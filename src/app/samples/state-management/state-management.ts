import { AsyncPipe } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { DemoToolbarComponent } from '../../shared/demo-toolbar/demo-toolbar';
import { DhxGanttComponent } from '@dhtmlx/trial-angular-gantt';
import { StateManagementStore, type ZoomLevel } from './state-management.store';

@Component({
  selector: 'app-state-management',
  standalone: true,
  imports: [AsyncPipe, DemoToolbarComponent, DhxGanttComponent],
  providers: [StateManagementStore],
  templateUrl: './state-management.html',
  styleUrl: './state-management.css',
  encapsulation: ViewEncapsulation.None
})
export class StateManagementComponent {
  private readonly store = inject(StateManagementStore);

  readonly vm$ = this.store.vm$;
  readonly dataConfig = this.store.dataConfig;

  setZoom(level: ZoomLevel): void {
    this.store.setZoom(level);
  }

  undo(): void {
    this.store.undo();
  }

  redo(): void {
    this.store.redo();
  }
}
