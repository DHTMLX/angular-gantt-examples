import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dhx-status-button-template',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      type="button" 
      class="status-button"
      [class.completed]="isCompleted()"
      (click)="onToggle?.()">
      {{ buttonText() }}
    </button>
  `,
  styles: [`
    .status-button {
      line-height: normal;
      border: 0;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      cursor: pointer;
      background: #0f7ed9;
    }

    .completed {
      background: #2f9d44;
    }

  `],
})
export class StatusButtonTemplateComponent {
  @Input() set task(value: any) {
    this._task = value;
  }
  private _task: any = null;

  @Input() onToggle: (() => void) | null = null;

  //Computed signals - IMMUNE to NG0100
  isCompleted = computed(() => !!this._task?.completed);
  buttonText = computed(() => this._task?.completed ? 'Done' : 'Not Done');
}
