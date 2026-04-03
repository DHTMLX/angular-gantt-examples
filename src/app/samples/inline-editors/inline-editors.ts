import { Component, ViewEncapsulation } from '@angular/core';
import { createBasicDemoData } from '../../shared/demo-data';

import { DhxGanttComponent } from '@dhtmlx/trial-angular-gantt';

@Component({
  selector: 'inline-editors',
  standalone: true,
  imports: [DhxGanttComponent],
  templateUrl: './inline-editors.html',
  styleUrl: './inline-editors.css',
  encapsulation: ViewEncapsulation.None
})

export class EditorComponent {
  private readonly initial = createBasicDemoData();

  tasks = this.initial.tasks;
  links = this.initial.links;


  config = {
    columns: [
      { name: "text", label: "Task name", tree: true, width: "*", editor: { type: "text", map_to: "text" } },
      { name: "start_date", label: "Start", align: "center", editor: { type: "date", map_to: "start_date", min: new Date(2025, 0, 1), max: new Date(2026, 0, 1) } },
      { name: "duration", label: "Duration", align: "center", editor: { type: "number", map_to: "duration", min: 0, max: 100 } },
      { name: "add", width: 44 },
    ],
    date_format: "%Y-%m-%d %H:%i",
  };

}
