import { describe, expect, it } from 'vitest';
import { firstValueFrom } from 'rxjs';
import {
  StateManagementStore,
  type StateManagementViewModel,
} from './state-management.store';

const getVm = (store: StateManagementStore): Promise<StateManagementViewModel> =>
  firstValueFrom(store.vm$);

const getTaskText = (vm: StateManagementViewModel, id: string | number): string | undefined =>
  vm.tasks.find((task) => String(task.id) === String(id))?.text;

describe('StateManagementStore', () => {
  it('keeps config reference stable for non-zoom updates and history navigation', async () => {
    const store = new StateManagementStore();
    const initialVm = await getVm(store);
    const initialConfig = initialVm.config;
    const initialTaskText = getTaskText(initialVm, 17);

    store.applyBatch({
      tasks: [
        {
          entity: 'task',
          action: 'update',
          id: 17,
          data: { text: 'Develop System (edited)' },
        },
      ],
    });

    const afterBatch = await getVm(store);
    expect(afterBatch.config).toBe(initialConfig);
    expect(getTaskText(afterBatch, 17)).toBe('Develop System (edited)');

    store.undo();
    const afterUndo = await getVm(store);
    expect(afterUndo.config).toBe(initialConfig);
    expect(getTaskText(afterUndo, 17)).toBe(initialTaskText);

    store.redo();
    const afterRedo = await getVm(store);
    expect(afterRedo.config).toBe(initialConfig);
    expect(getTaskText(afterRedo, 17)).toBe('Develop System (edited)');
  });

  it('replaces config only when zoom changes', async () => {
    const store = new StateManagementStore();
    const initialVm = await getVm(store);
    const initialConfig = initialVm.config;

    store.setZoom('month');
    const monthVm = await getVm(store);
    expect(monthVm.config).not.toBe(initialConfig);
    expect(monthVm.config.zoom.current).toBe('month');

    const monthConfig = monthVm.config;
    store.setZoom('month');
    const sameZoomVm = await getVm(store);
    expect(sameZoomVm.config).toBe(monthConfig);
    expect(sameZoomVm.zoomLevel).toBe('month');

    store.undo();
    const undoVm = await getVm(store);
    expect(undoVm.zoomLevel).toBe('day');
    expect(undoVm.config.zoom.current).toBe('day');
    expect(undoVm.config).not.toBe(monthConfig);

    store.redo();
    const redoVm = await getVm(store);
    expect(redoVm.zoomLevel).toBe('month');
    expect(redoVm.config.zoom.current).toBe('month');
  });
});
