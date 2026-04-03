import { Component, ViewEncapsulation } from '@angular/core';
import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { createBasicDemoData } from '../../shared/demo-data';

import { DhxGanttComponent, type AngularGanttDataConfig } from '@dhtmlx/trial-angular-gantt';

@Component({
  selector: 'app-configs-and-templates',
  standalone: true,
  imports: [DemoToolbarComponent, DhxGanttComponent],
  templateUrl: './configs-and-templates.html',
  styleUrl: './configs-and-templates.css',
  encapsulation: ViewEncapsulation.None
})
export class ConfigsAndTemplatesComponent {
  private readonly initial = createBasicDemoData();

  tasks = this.initial.tasks;
  links = this.initial.links;
  plugins = { marker: true };
  showMonths = false;
  emphasizeHighProgress = false;
  markers = [{
    id: "marker1",
    start_date: new Date(2026, 1, 3),
    css: "today",
    text: "Start",
  }]
  get config() {
    return {
      scales: this.showMonths
        ? [
          { unit: "month", step: 1, format: "%F %Y" },
          { unit: "day", step: 1, format: "%d" },
        ]
        : [
          { unit: "week", step: 1, format: "Week #%W" },
          { unit: "day", step: 1, format: "%D %d" },
        ],
      columns: [
        { name: "text", label: "Task", tree: true, width: "*" },
        { name: "start_date", label: "Start", align: "center" },
        { name: "duration", label: "Duration", align: "center" },
        { name: "add", width: 44 },
      ],
      date_format: "%Y-%m-%d %H:%i",
      bar_height: 60
    } as any;
  }

  get templates() {
    return {
      task_text: (start: any, end: any, task: any) => {
        if (this.emphasizeHighProgress) {
          const pct = Math.round((task.progress || 0) * 100);
          return `<b>${task.text}</b> <span style="opacity:.75">(${pct}%)</span>`;
        }
        return task.text;
      },
      task_class: (start: any, end: any, task: any) => {
        if (this.emphasizeHighProgress && (task.progress || 0) >= 0.4) {
          return "demo-highlight-task";
        }
        return "";
      },
    };
  }

  dataConfig: AngularGanttDataConfig = {
    save: (entity, action, data, id) => {
      console.log('[data.save]', entity, action, data, id);
    },
  };

  toggleScales() {
    this.showMonths = !this.showMonths;
  }

  toggleTemplateEmphasis() {
    this.emphasizeHighProgress = !this.emphasizeHighProgress;
  }
}