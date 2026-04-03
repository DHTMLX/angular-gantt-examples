import { Component, ViewEncapsulation } from '@angular/core';
import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { createBasicDemoData } from '../../shared/demo-data';

import { DhxGanttComponent, type AngularGanttDataConfig } from '@dhtmlx/trial-angular-gantt';

@Component({
  selector: 'app-basic-initialization',
  standalone: true,
  imports: [DemoToolbarComponent, DhxGanttComponent],
  templateUrl: './basic-initialization.html',
  styleUrl: './basic-initialization.css',
  encapsulation: ViewEncapsulation.None
})

export class BasicInitializationComponent {
  private readonly initial = createBasicDemoData();

  tasks = this.initial.tasks;
  links = this.initial.links;

  config = {
    columns: [
      { name: "text", label: "Task name", tree: true, width: "*" },
      { name: "start_date", label: "Start", align: "center" },
      { name: "duration", label: "Duration", align: "center" },
      { name: "add", width: 44 },
    ],
    date_format: "%Y-%m-%d %H:%i",
  };

  dataConfig: AngularGanttDataConfig = {
    save: (entity, action, data, id) => {
      console.log('[data.save]', entity, action, data, id);
    },
  };

  addTask() {
    const numericIds = this.tasks.map(t => Number(t.id)).filter(n => Number.isFinite(n));
    const nextId = (numericIds.length > 0 ? Math.max(...numericIds) : 0) + 1;

    this.tasks = [
      ...this.tasks,
      { id: nextId, text: `New Task #${nextId}`, start_date: "2026-02-05", duration: 2, parent: 1 },
    ];
  }
}
