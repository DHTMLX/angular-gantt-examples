import { Injectable } from '@angular/core';
import type { AngularGanttDataConfig, BatchChanges, Task, Link, ZoomLevel as GanttZoomLevel } from '@dhtmlx/trial-angular-gantt';
import { BehaviorSubject, map } from 'rxjs';
import { applyBatchChanges } from '../../shared/apply-batch-changes';
import { createProjectDemoData } from '../../shared/project-data';

export type ZoomLevel = 'day' | 'month' | 'year';

interface Snapshot {
  tasks: Task[];
  links: Link[];
  zoomLevel: ZoomLevel;
}

interface StateManagementStoreState {
  tasks: Task[];
  links: Link[];
  zoomLevel: ZoomLevel;
  config: StateManagementConfig;
  past: Snapshot[];
  future: Snapshot[];
}

interface StateManagementConfig {
  date_format: string;
  zoom: {
    current: ZoomLevel;
    levels: typeof zoomLevels;
  };
}

export interface StateManagementViewModel {
  tasks: Task[];
  links: Link[];
  zoomLevel: ZoomLevel;
  canUndo: boolean;
  canRedo: boolean;
  config: StateManagementConfig;
}

const zoomLevels: GanttZoomLevel[] = [
  {
    name: 'day',
    scale_height: 27,
    min_column_width: 80,
    scales: [{ unit: 'day', step: 1, format: '%d %M' }],
  },
  {
    name: 'month',
    scale_height: 50,
    min_column_width: 120,
    scales: [
      { unit: 'month', format: '%F, %Y' },
      { unit: 'week', format: 'Week #%W' },
    ],
  },
  {
    name: 'year',
    scale_height: 50,
    min_column_width: 36,
    scales: [{ unit: 'year', step: 1, format: '%Y' }],
  },
];

const cloneDate = (value: unknown): unknown => {
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  return value;
};

const cloneTask = (task: Task): Task => {
  const next: Task = { ...task };
  next.start_date = cloneDate(task.start_date) as Date | undefined;
  next.end_date = cloneDate(task.end_date) as Date | undefined;
  return next;
};

const cloneLink = (link: Link): Link => ({ ...link });

const createConfig = (zoomLevel: ZoomLevel): StateManagementConfig => ({
  date_format: '%Y-%m-%d %H:%i',
  zoom: {
    current: zoomLevel,
    levels: zoomLevels,
  },
});

const updateConfigForZoom = (
  config: StateManagementConfig,
  zoomLevel: ZoomLevel,
): StateManagementConfig => {
  if (config.zoom.current === zoomLevel) {
    return config;
  }

  return {
    ...config,
    zoom: {
      ...config.zoom,
      current: zoomLevel,
    },
  };
};

@Injectable()
export class StateManagementStore {
  private readonly maxHistory = 50;
  private readonly stateSubject = new BehaviorSubject<StateManagementStoreState>(
    this.createInitialState(),
  );
  private readonly state$ = this.stateSubject.asObservable();

  readonly vm$ = this.state$.pipe(map((state) => this.createViewModel(state)));

  readonly dataConfig: AngularGanttDataConfig = {
    batchSave: (changes: BatchChanges) => this.applyBatch(changes),
  };

  setZoom(level: ZoomLevel): void {
    const state = this.stateSubject.value;
    if (state.zoomLevel === level) {
      return;
    }

    const withHistory = this.pushHistory(state);
    this.stateSubject.next({
      ...withHistory,
      zoomLevel: level,
      config: updateConfigForZoom(withHistory.config, level),
    });
  }

  undo(): void {
    const state = this.stateSubject.value;
    if (state.past.length === 0) {
      return;
    }

    const previous = state.past[state.past.length - 1];
    const current = this.createSnapshot(state);
    const restored = this.restoreSnapshot(previous);

    this.stateSubject.next({
      ...state,
      ...restored,
      config: updateConfigForZoom(state.config, restored.zoomLevel),
      past: state.past.slice(0, -1),
      future: [current, ...state.future],
    });
  }

  redo(): void {
    const state = this.stateSubject.value;
    if (state.future.length === 0) {
      return;
    }

    const next = state.future[0];
    const current = this.createSnapshot(state);
    const nextPast = this.trimPast([...state.past, current]);
    const restored = this.restoreSnapshot(next);

    this.stateSubject.next({
      ...state,
      ...restored,
      config: updateConfigForZoom(state.config, restored.zoomLevel),
      past: nextPast,
      future: state.future.slice(1),
    });
  }

  applyBatch(changes: BatchChanges): void {
    const hasChanges = (changes.tasks?.length ?? 0) > 0 || (changes.links?.length ?? 0) > 0;
    if (!hasChanges) {
      return;
    }

    const state = this.stateSubject.value;
    const withHistory = this.pushHistory(state);
    const next = applyBatchChanges<Task, Link>(
      withHistory.tasks,
      withHistory.links,
      changes,
    );

    this.stateSubject.next({
      ...withHistory,
      tasks: next.tasks,
      links: next.links,
    });
  }

  private createInitialState(): StateManagementStoreState {
    const initial = createProjectDemoData();
    return {
      tasks: initial.tasks,
      links: initial.links,
      zoomLevel: 'day',
      config: createConfig('day'),
      past: [],
      future: [],
    };
  }

  private createViewModel(state: StateManagementStoreState): StateManagementViewModel {
    return {
      tasks: state.tasks,
      links: state.links,
      zoomLevel: state.zoomLevel,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      config: state.config,
    };
  }

  private pushHistory(state: StateManagementStoreState): StateManagementStoreState {
    return {
      ...state,
      past: this.trimPast([...state.past, this.createSnapshot(state)]),
      future: [],
    };
  }

  private createSnapshot(state: StateManagementStoreState): Snapshot {
    return {
      tasks: state.tasks.map(cloneTask),
      links: state.links.map(cloneLink),
      zoomLevel: state.zoomLevel,
    };
  }

  private restoreSnapshot(snapshot: Snapshot): Pick<StateManagementStoreState, 'tasks' | 'links' | 'zoomLevel'> {
    return {
      tasks: snapshot.tasks.map(cloneTask),
      links: snapshot.links.map(cloneLink),
      zoomLevel: snapshot.zoomLevel,
    };
  }

  private trimPast(past: Snapshot[]): Snapshot[] {
    if (past.length <= this.maxHistory) {
      return past;
    }
    return past.slice(past.length - this.maxHistory);
  }
}
