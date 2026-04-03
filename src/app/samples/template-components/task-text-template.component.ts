import { Component, Input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dhx-task-text-template',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="task-text-chip">
      <button type="button" class="task-text-icon" (click)="onIconClick?.()">
        {{ statusIcon() }}
      </button>
      <span class="task-text-value">{{ taskText() }}</span>
    </div>
  `,
  styles: [`
    .task-text-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 2px 6px;
      border: 1px solid #c7ccd1;
      border-radius: 999px;
      background: #fff;
      color: #1c2b36;
      line-height: 1.2;
    }

    .task-text-icon {
      width: 18px;
      height: 18px;
      border: 0;
      border-radius: 50%;
      font-size: 12px;
      background: #edf1f4;
      color: #1c2b36;
      cursor: pointer;
      padding: 0;
      line-height: 18px;
      text-align: center;
    }

    .task-text-value {
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
    }
  `],
})
export class TaskTextTemplateComponent {
  @Input() set task(value: any) {
    this._task = value;
  }
  private _task: any = null;


  @Input() onIconClick: (() => void) | null = null;


  // Computed signals - IMMUNE to NG0100
  statusIcon = computed(() => this._task?.completed ? '[x]' : '[ ]');
  taskText = computed(() => this._task?.text || '');
}