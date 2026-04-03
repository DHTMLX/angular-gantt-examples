import type { SerializedTask, SerializedLink } from '@dhtmlx/trial-angular-gantt';

export function createBasicDemoData() {
  const tasks: SerializedTask[] = [
    { id: 1, text: "Project", type: "project", start_date: "2026-02-03", duration: 10, open: true },
    { id: 2, text: "Planning", parent: 1, start_date: "2026-02-03", duration: 3, progress: 0.4, open: true, calendar_id: "custom" },
    { id: 3, text: "Requirements", parent: 2, start_date: "2026-02-07", duration: 2, progress: 0.2 },
    { id: 4, text: "Implementation", parent: 1, start_date: "2026-02-08", duration: 5, progress: 0.1, open: true },
    { id: 5, text: "QA", parent: 1, start_date: "2026-02-11", duration: 2, progress: 0.0, calendar_id: "custom"  },
  ];

  const links: SerializedLink[] = [
    { id: 1, source: 3, target: 4, type: "0" },
    { id: 2, source: 4, target: 5, type: "0" },
  ];

  return { tasks, links };
}
