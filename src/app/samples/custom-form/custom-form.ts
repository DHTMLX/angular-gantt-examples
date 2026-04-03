import { Component, ViewEncapsulation } from '@angular/core';
import { createBasicDemoData } from '../../shared/demo-data';

import { CustomLightboxConfig, DhxGanttComponent } from '@dhtmlx/trial-angular-gantt';
import { CustomLightboxComponent } from '../../shared/custom-form/custom-form';

@Component({
  selector: 'custom-form',
  standalone: true,
  imports: [DhxGanttComponent],
  templateUrl: './custom-form.html',
  styleUrl: './custom-form.css',
  encapsulation: ViewEncapsulation.None
})

export class CustomFormComponent {
  private readonly initial = createBasicDemoData();

  tasks = this.initial.tasks;
  links = this.initial.links;
  ganttLightboxConfig: CustomLightboxConfig = {
    component: CustomLightboxComponent,
    onSave: (data) => console.log('Saved:', data),
    onCancel: () => console.log('Cancelled'),
    onDelete: (id) => console.log('Deleted:', id)
  };

  config = {
    columns: [
      { name: "text", label: "Task name", tree: true, width: "*" },
      { name: "start_date", label: "Start", align: "center" },
      { name: "duration", label: "Duration", align: "center" },
      { name: "add", width: 44 },
    ],
    date_format: "%Y-%m-%d %H:%i",
  };

}
