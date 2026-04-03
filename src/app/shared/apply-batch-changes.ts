import type { BatchChanges, DataCallbackChange } from '@dhtmlx/trial-angular-gantt';

const toId = (value: string | number) => String(value);

type DemoEntityWithId = {
  id: string | number;
};

type BatchAction = 'update' | 'create' | 'delete';

const isBatchAction = (action: string): action is BatchAction =>
  action === 'update' || action === 'create' || action === 'delete';

export function applyTaskChanges<TTask extends DemoEntityWithId>(
  prevTasks: TTask[],
  changes: DataCallbackChange[] = [],
): TTask[] {
  const nextTasks = [...prevTasks];

  changes.forEach(change => {
    if (!isBatchAction(change.action)) {
      return;
    }

    const index = nextTasks.findIndex(task => toId(task.id) === toId(change.id));

    if (change.action === "update" && index !== -1) {
      nextTasks[index] = { ...nextTasks[index], ...(change.data as Partial<TTask>) };
      return;
    }

    if (change.action === "create") {
      nextTasks.push(change.data as TTask);
      return;
    }

    if (change.action === "delete" && index !== -1) {
      nextTasks.splice(index, 1);
    }
  });

  return nextTasks;
}

export function applyLinkChanges<TLink extends DemoEntityWithId>(
  prevLinks: TLink[],
  changes: DataCallbackChange[] = [],
): TLink[] {
  const nextLinks = [...prevLinks];

  changes.forEach(change => {
    if (!isBatchAction(change.action)) {
      return;
    }

    const index = nextLinks.findIndex(link => toId(link.id) === toId(change.id));

    if (change.action === "update" && index !== -1) {
      nextLinks[index] = { ...nextLinks[index], ...(change.data as Partial<TLink>) };
      return;
    }

    if (change.action === "create") {
      nextLinks.push(change.data as TLink);
      return;
    }

    if (change.action === "delete" && index !== -1) {
      nextLinks.splice(index, 1);
    }
  });

  return nextLinks;
}

export function applyBatchChanges<TTask extends DemoEntityWithId, TLink extends DemoEntityWithId>(
  tasks: TTask[],
  links: TLink[],
  changes: BatchChanges,
): { tasks: TTask[]; links: TLink[] } {
  return {
    tasks: applyTaskChanges(tasks, changes.tasks),
    links: applyLinkChanges(links, changes.links)
  };
}
