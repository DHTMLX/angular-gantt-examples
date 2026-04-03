import { Component, ViewEncapsulation } from '@angular/core';

import type { GanttStatic } from '@dhx/gantt';
import { DhxGanttComponent, templateComponent, type TaskFilter } from '@dhtmlx/trial-angular-gantt';

import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { createBasicDemoData } from '../../shared/demo-data';
import { HeaderFilterTemplateComponent } from './header-filter-template.component';
import { StatusButtonTemplateComponent } from './status-button-template.component';
import { TaskTextTemplateComponent } from './task-text-template.component';

@Component({
  selector: 'app-template-components',
  standalone: true,
  imports: [DemoToolbarComponent, DhxGanttComponent],
  templateUrl: './template-components.html',
  styleUrl: './template-components.css',
  encapsulation: ViewEncapsulation.None,
})
export class TemplateComponentsComponent {
  private readonly initial = createBasicDemoData();
  private ganttInstance: GanttStatic | null = null;

  tasks = this.initial.tasks.map((task, index) => ({
    ...task,
    completed: index % 2 === 0,
  }));

  links = this.initial.links;

  theme = 'terrace';
  locale = 'en';

  filterLabel = 'All';
  taskFilter: TaskFilter = null;

  readonly templates = {
    task_text: (_start: Date, _end: Date, task: any) =>
      templateComponent(TaskTextTemplateComponent, {
        task,
        onIconClick: () => this.handleTaskIconClick(task),
      }),
  };

  readonly config: any = {
    scales: [
      { unit: 'year', step: 1, format: '%Y' },
      { unit: 'month', step: 1, format: '%F, %Y' },
      { unit: 'day', step: 1, format: '%d %M' },
    ],
    columns: [
      { name: 'text', tree: true, width: 200, resize: true },
      { name: 'start_date', width: 130, align: 'center', resize: true },
      { name: 'duration', width: 90, align: 'center', resize: true },
      {
        name: 'custom',
        align: 'center',
        width: 160,
        resize: true,
        label: this.createHeaderLabelDescriptor(),
        template: (task: any) =>
          templateComponent(StatusButtonTemplateComponent, {
            task,
            onToggle: () => this.toggleCompleted(task),
          }),
      },
      { name: 'add', width: 44 },
    ],
    date_format: '%Y-%m-%d %H:%i',
    row_height: 50,
    scale_height: 90,
  };

  onReady({ instance }: { instance: GanttStatic }): void {
    this.ganttInstance = instance;
  }

  toggleTheme(): void {
    this.theme = this.theme === 'terrace' ? 'dark' : 'terrace';
  }

  toggleLocale(): void {
    this.locale = this.locale === 'en' ? 'es' : 'en';
  }

  private handleTaskIconClick(task: any): void {
    this.toggleCompleted(task);
  }

  private handleFilterSelected(filterType: string): void {
    if (filterType === 'done') {
      this.filterLabel = 'Done';
    } else if (filterType === 'notDone') {
      this.filterLabel = 'Not Done';
    } else {
      this.filterLabel = 'All';
    }

    this.updateTaskFilter();

    const customColumn = this.getCustomColumn();
    if (customColumn) {
      customColumn.label = this.createHeaderLabelDescriptor();
    }
  }

  private updateTaskFilter(): void {
    const filterLabel = this.filterLabel;
    if (filterLabel === 'All') {
      this.taskFilter = null;
      return;
    }
    this.taskFilter = (task) => {
      if (filterLabel === 'Done') return !!task['completed'];
      if (filterLabel === 'Not Done') return !task['completed'];
      return true;
    };
  }

  private toggleCompleted(task: any): void {
    task.completed = !task.completed;
    this.ganttInstance?.updateTask(task.id);
  }

  private getCustomColumn(): any | null {
    const columns = Array.isArray(this.config?.columns) ? this.config.columns : [];
    return columns.find((column: any) => column?.name === 'custom') ?? null;
  }

  private createHeaderLabelDescriptor() {
    return templateComponent(HeaderFilterTemplateComponent, {
      currentFilterLabel: this.filterLabel,
      onFilterSelected: (filterType: string) => this.handleFilterSelected(filterType),
    });
  }
}
