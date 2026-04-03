import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { createBasicDemoData } from '../../shared/demo-data';

import { DhxGanttComponent, type AngularGanttDataConfig } from '@dhtmlx/trial-angular-gantt';

@Component({
  selector: 'calendars',
  standalone: true,
  imports: [DemoToolbarComponent, DhxGanttComponent],
  templateUrl: './calendars.html',
  styleUrl: './calendars.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarsComponent {
  private readonly initial = createBasicDemoData();
  @ViewChild(DhxGanttComponent) ganttCmp?: DhxGanttComponent;

  tasks = this.initial.tasks;
  links = this.initial.links;
  locale = 'ru';
  calendars = [
    {
      id: 'custom', // optional
      worktime: {
        hours: ['9:00-18:00'],
        days: [1, 1, 1, 1, 0, 0, 0],
      },
    },
  ];
  get config() {
    return {
      columns: [
        { name: 'text', label: 'Task name', tree: true, width: '*' },
        { name: 'start_date', label: 'Start', align: 'center' },
        { name: 'duration', label: 'Duration', align: 'center' },
        { name: 'add', width: 44 },
      ],
      date_format: '%Y-%m-%d %H:%i',
      work_time: true,
      scales: [
        { unit: "month", step: 1, format: "%F, %Y" },
        { unit: "day", step: 1, format: "%D, %d" }
      ] as any,
      duration_unit: "day"
    };
  }

  dataConfig: AngularGanttDataConfig = {
    save: (entity, action, data, id) => {
      console.log('[data.save]', entity, action, data, id);
    },
  };
  get templates() {
    return {
      timeline_cell_class: (task: any, date: Date) => {
        const gantt = this.ganttCmp?.instance;
        if (!gantt) return;
        if (!gantt.isWorkTime({ date: date, task: task })) return 'week_end';
        return '';
      },
    };
  }
  addTask() {
    const numericIds = this.tasks.map((t) => Number(t.id)).filter((n) => Number.isFinite(n));
    const nextId = (numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1;

    this.tasks = [
      ...this.tasks,
      { id: nextId, text: `New Task #${nextId}`, start_date: '2026-02-05', duration: 2, parent: 1 },
    ];
  }

  getWorktime() {
    const gantt = this.ganttCmp?.instance;
    if (!gantt) return;

    // Intentionally minimal - finalize later against exact API.
    console.log(gantt.getCalendars());
  }
}
