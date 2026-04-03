import { Component, ViewEncapsulation } from '@angular/core';
import { createBasicDemoData } from '../../shared/demo-data';

import { CustomLightboxConfig, DhxGanttComponent } from '@dhtmlx/trial-angular-gantt';
import { AdvancedFormComponent } from '../../shared/advanced-form/advanced-form';

@Component({
  selector: 'advanced-form',
  standalone: true,
  imports: [DhxGanttComponent],
  templateUrl: './advanced-form.html',
  styleUrl: './advanced-form.css',
  encapsulation: ViewEncapsulation.None
})

export class AdvancedFormSampleComponent {
  private readonly initial = createBasicDemoData();

  tasks = this.initial.tasks;
  links = this.initial.links;
  ganttLightboxConfig: CustomLightboxConfig = {
    component: AdvancedFormComponent,
    onSave: (data) => console.log('Saved:', data),
    onCancel: () => console.log('Cancelled'),
    onDelete: (id) => console.log('Deleted:', id)
  };

  plugins = { auto_scheduling: true };

  config = {
    auto_scheduling: {
      enabled: true,
      apply_constraints: false,
      gap_behavior: "compress" as const
    },
    columns: [
      { name: "text", label: "Task name", tree: true, width: "*" },
      { name: "start_date", label: "Start", align: "center" },
      { name: "duration", label: "Duration", align: "center" },
      { name: "add", width: 44 },
    ],
    date_format: "%Y-%m-%d %H:%i",
  };
}
