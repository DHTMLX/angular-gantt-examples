import { Component, ViewEncapsulation } from '@angular/core';
import {
  type DatastoreMethods,
  DhxGanttComponent,
  type AngularGanttTemplates,
  type GanttConfigOptions,
  type ResourceFilter,
  type GanttStatic,
  type ResourceAssignment,
  type ResourceItem,
  type Task,
  type TreeDatastoreMethods,
} from '@dhtmlx/trial-angular-gantt';
import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { createResourceDemoData, type ResourceDemoResource } from '../../shared/resource-data';

const RESOURCE_CONFIG = {
  scale_height: 30,
  row_height: 45,
  scales: [{ unit: 'day', step: 1, date: '%d %M' }],
};

@Component({
  selector: 'app-resource-panel',
  standalone: true,
  imports: [DemoToolbarComponent, DhxGanttComponent],
  templateUrl: './resource-panel.html',
  styleUrl: './resource-panel.css',
  encapsulation: ViewEncapsulation.None,
})
export class ResourcePanelComponent {
  private readonly dataSet = createResourceDemoData();
  private ganttInstance: GanttStatic | null = null;

  tasks = this.dataSet.tasks;
  links = this.dataSet.links;
  resources = this.dataSet.resources;

  selectedResourceId = '';
  resourceFilter: ResourceFilter = null;

  readonly filterableResources = this.resources.filter((resource) => typeof resource.unit === 'string');

  readonly templates: AngularGanttTemplates = {
    timeline_cell_class: (task: Task, date: Date) => (this.isWorkTime(date, task) ? '' : 'week_end'),
    histogram_cell_class: (start: Date, _end: Date, resource: ResourceDemoResource, tasks: Task[] = []) => {
      const allocated = this.getAllocatedValue(tasks, resource);
      const capacity = this.getHistogramCapacity(start, resource);
      return allocated > capacity ? 'column_overload' : '';
    },
    histogram_cell_label: (start: Date, _end: Date, resource: ResourceDemoResource, tasks: Task[] = []) => {
      if (this.isGroupResource(resource)) {
        return '';
      }
      const allocated = this.getAllocatedValue(tasks, resource);
      const capacity = this.getHistogramCapacity(start, resource);
      return tasks.length ? `${allocated}/${capacity}` : '-';
    },
    histogram_cell_allocated: (_start: Date, _end: Date, resource: ResourceDemoResource, tasks: Task[] = []) =>
      this.getAllocatedValue(tasks, resource),
    histogram_cell_capacity: (start: Date, _end: Date, resource: ResourceDemoResource) =>
      this.getHistogramCapacity(start, resource),

    grid_row_class: (_start: Date, _end: Date, resource: Task | ResourceDemoResource | ResourceItem) => {
      const resourceItem = resource as ResourceDemoResource;
      if (this.isGroupResource(resourceItem)) {
        return 'folder_row group_row';
      }
      return '';
    },

    task_row_class: (_start: Date, _end: Date, resource: Task | ResourceDemoResource | ResourceItem) => {
      const resourceItem = resource as ResourceDemoResource;
      if (this.isGroupResource(resourceItem)) {
        return 'group_row';
      }
      return '';
    },
  };

  readonly config: Partial<GanttConfigOptions> = {
    columns: [
      { name: 'text', tree: true, width: 200, resize: true },
      { name: 'start_date', align: 'center', width: 100, resize: true },
      {
        name: 'owner',
        align: 'center',
        width: 75,
        label: 'Owner',
        resize: true,
        template: (task: Task) => this.renderTaskOwner(task),
      },
      { name: 'duration', width: 60, align: 'center', resize: true },
      { name: 'add', width: 44 },
    ],
    resources: true,
    resource_store: 'resource',
    resource_property: 'owner',
    resource_render_empty_cells: true,
    order_branch: true,
    open_tree_initially: true,
    lightbox: {
      sections: [
        { name: 'description', height: 38, map_to: 'text', type: 'textarea', focus: true },
        { name: 'resources', label: 'Resources', type: 'resources', map_to: 'auto', default_value: 8 },
        { name: 'time', type: 'duration', map_to: 'auto' },
      ],
    } as unknown as GanttConfigOptions['lightbox'],
    layout: {
      css: 'gantt_container',
      rows: [
        {
          gravity: 2,
          cols: [
            { view: 'grid', group: 'grids', scrollY: 'scrollVer' },
            { resizer: true, width: 1 },
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollVer', group: 'vertical' },
          ],
        },
        { resizer: true, width: 1, next: 'resources' },
        {
          gravity: 1,
          id: 'resources',
          config: {
            ...RESOURCE_CONFIG,
            columns: [
              {
                name: 'name',
                label: 'Name',
                tree: true,
                width: 200,
                resize: true,
                template: (resource: ResourceDemoResource) => resource.text,
              },
              {
                name: 'progress',
                label: 'Complete',
                align: 'center',
                resize: true,
                template: (resource: ResourceDemoResource) => this.getResourceCompletion(resource),
              },
              {
                name: 'workload',
                label: 'Workload',
                align: 'center',
                resize: true,
                template: (resource: ResourceDemoResource) => this.getResourceWorkload(resource),
              },
              {
                name: 'capacity',
                label: 'Capacity',
                align: 'center',
                resize: true,
                template: (resource: ResourceDemoResource) => this.getResourceCapacity(resource),
              },
            ],
          },
          cols: [
            { view: 'resourceGrid', group: 'grids', scrollY: 'resourceVScroll' },
            { resizer: true, width: 1 },
            { view: 'resourceHistogram', capacity: 24, scrollX: 'scrollHor', scrollY: 'resourceVScroll' },
            { view: 'scrollbar', id: 'resourceVScroll', group: 'vertical' },
          ],
        },
        { view: 'scrollbar', id: 'scrollHor' },
      ],
    },
  };

  onReady({ instance }: { instance: GanttStatic }): void {
    this.ganttInstance = instance;
  }

  onResourceFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === this.selectedResourceId) {
      return;
    }
    this.selectedResourceId = value;
    if (!value) {
      this.resourceFilter = null;
      return;
    }
    this.resourceFilter = (resource: ResourceDemoResource) => {
      return String(resource.id) === String(value);
    };
  }

  private renderTaskOwner(task: Task): string {
    const gantt = this.ganttInstance;
    if (!gantt) {
      return '';
    }
    if (task.type === gantt.config.types.project) {
      return '';
    }

    const taskResources = gantt.getTaskResources(task.id) || [];
    if (!taskResources.length) {
      return 'Unassigned';
    }
    if (taskResources.length === 1) {
      return taskResources[0].text ?? '';
    }

    return taskResources
      .map((resource) => {
        const resourceText = resource.text ?? '';
        return `<div class='owner-label' title='${resourceText}'>${resourceText.charAt(0)}</div>`;
      })
      .join('');
  }

  private isWorkTime(date: Date, task?: Task): boolean {
    const gantt = this.ganttInstance;
    if (!gantt) {
      return true;
    }
    return gantt.isWorkTime({ date, task });
  }

  private isGroupResource(resource: ResourceDemoResource): boolean {
    const store = this.getResourceStore();
    if (!store) {
      return false;
    }
    return Boolean(store.hasChild(resource.id));
  }

  private getResourceChildren(resourceId: string | number): Array<string | number> {
    const store = this.getResourceStore();
    if (!store) {
      return [];
    }
    const children = store.getChildren(resourceId) || [];
    return children.filter((child): child is string | number => typeof child === 'string' || typeof child === 'number');
  }

  private getAssignments(resourceId: string | number, taskId?: string | number): ResourceAssignment[] {
    const gantt = this.ganttInstance;
    if (!gantt) {
      return [];
    }
    return gantt.getResourceAssignments(resourceId, taskId) || [];
  }

  private getTask(taskId: string | number): Task | null {
    const gantt = this.ganttInstance;
    if (!gantt || !gantt.isTaskExists(taskId)) {
      return null;
    }
    return gantt.getTask(taskId);
  }

  private getAllocatedValue(tasks: Task[], resource: ResourceDemoResource): number {
    return tasks.reduce((sum, task) => {
      const assignments = this.getAssignments(resource.id, task.id);
      const assigned = assignments.reduce((acc, assignment) => acc + Number(assignment.value || 0), 0);
      return sum + assigned;
    }, 0);
  }

  private getHistogramCapacity(start: Date, resource: ResourceDemoResource): number {
    if (!this.isWorkTime(start)) {
      return 0;
    }
    if (this.isGroupResource(resource)) {
      return this.getResourceChildren(resource.id).length * 8;
    }
    return 8;
  }

  private getResourceCompletion(resource: ResourceDemoResource): string {
    const assignments = this.getAssignments(resource.id);
    let totalToDo = 0;
    let totalDone = 0;

    assignments.forEach((assignment) => {
      const task = this.getTask(assignment.task_id);
      if (!task) {
        return;
      }
      const duration = Number(task.duration || 1);
      totalToDo += duration;
      totalDone += duration * Number(task.progress || 0);
    });

    const completion = totalToDo ? (totalDone / totalToDo) * 100 : 0;
    return `${Math.floor(completion)}%`;
  }

  private getResourceWorkload(resource: ResourceDemoResource): string {
    const assignments = this.getAssignments(resource.id);
    let totalDuration = 0;

    assignments.forEach((assignment) => {
      const task = this.getTask(assignment.task_id);
      if (!task) {
        return;
      }
      totalDuration += Number(assignment.value || 0) * Number(task.duration || 1);
    });

    return `${totalDuration || 0}h`;
  }

  private getResourceCapacity(resource: ResourceDemoResource): string {
    const gantt = this.ganttInstance;
    if (!gantt) {
      return '0h';
    }
    const resourceCount = this.isGroupResource(resource) ? this.getResourceChildren(resource.id).length : 1;
    const state = gantt.getState();
    const duration = gantt.calculateDuration(state.min_date, state.max_date);
    return `${duration * resourceCount * 8}h`;
  }

  private getResourceStore(): (DatastoreMethods & TreeDatastoreMethods) | null {
    const gantt = this.ganttInstance;
    if (!gantt) {
      return null;
    }
    const resourceStoreName = gantt.config.resource_store;
    if (!resourceStoreName) {
      return null;
    }
    return gantt.getDatastore(resourceStoreName);
  }
}
