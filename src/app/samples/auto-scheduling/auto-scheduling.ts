import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { createBasicDemoData } from '../../shared/demo-data';

import { DhxGanttComponent, type AngularGanttDataConfig } from '@dhtmlx/trial-angular-gantt';

@Component({
  selector: 'app-auto-scheduling',
  standalone: true,
  imports: [DemoToolbarComponent, DhxGanttComponent],
  templateUrl: './auto-scheduling.html',
  styleUrl: './auto-scheduling.css',
  encapsulation: ViewEncapsulation.None
})
export class AutoSchedulingComponent {
  private readonly initial = createBasicDemoData();

  tasks = this.initial.tasks;
  links = this.initial.links;

  @ViewChild(DhxGanttComponent) ganttCmp?: DhxGanttComponent;

  plugins = { auto_scheduling: true };

  config = {
    auto_scheduling: {
      enabled: true,
      apply_constraints: false,
      gap_behavior: "compress" as const
    },
    columns: [
      { name: "text", label: "Task", tree: true, width: "*" },
      { name: "start_date", label: "Start", align: "center" },
      { name: "duration", label: "Duration", align: "center" },
      { name: "add", width: 44 },
    ],
    date_format: "%Y-%m-%d %H:%i",
  };

  dataConfig: AngularGanttDataConfig = {
    batchSave: (changes) => {
      console.log('[data.batchSave]', changes);
    },
  };
  runAutoSchedule() {
    const gantt = this.ganttCmp?.instance;
    if (!gantt) return;
    gantt.autoSchedule();
  }
}