import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { GanttStatic, Task, Link, SerializedTask, SerializedLink } from '@dhtmlx/trial-angular-gantt';

interface PredecessorRow {
  linkId: string | number | null;
  sourceId: string | number | null;
  sourceName: string;
  type: string;
  lag: number;
}

const LINK_TYPES = [
  { value: '0', label: 'Finish-to-Start (FS)' },
  { value: '1', label: 'Start-to-Start (SS)' },
  { value: '2', label: 'Finish-to-Finish (FF)' },
  { value: '3', label: 'Start-to-Finish (SF)' },
];

@Component({
  selector: 'advanced-lightbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './advanced-form.html',
  styleUrl: './advanced-form.css',
})
export class AdvancedFormComponent {
  @Input() data!: { id: string | number; task: Task | SerializedTask };
  @Input() gantt!: GanttStatic;
  @Input() onSave!: (task: Task | SerializedTask) => void;
  @Input() onCancel!: () => void;
  @Input() onDelete!: () => void;

  localTask: any = {};
  activeTab: 'general' | 'predecessors' = 'general';
  predecessors: PredecessorRow[] = [];
  availableTasks: { id: string | number; text: string }[] = [];
  linkTypes = LINK_TYPES;

  ngOnInit() {
    if (this.data?.task) {
      this.localTask = { ...this.data.task };
    }
    if (this.gantt && !this.isNewTask) {
      this.initPredecessors();
      this.initAvailableTasks();
    }
  }

  get isNewTask(): boolean {
    return Boolean(this.localTask?.$new);
  }

  get startDateStr(): string {
    const d = this.localTask.start_date;
    if (d instanceof Date) {
      return this.dateToString(d);
    }
    return typeof d === 'string' ? d.substring(0, 10) : '';
  }

  onStartDateChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (val) {
      this.localTask.start_date = this.stringToDate(val);
    }
  }

  onSaveClick() {
    this.onSave(this.localTask);
    if (this.gantt && !this.isNewTask) {
      this.applyLinkChanges();
    }
  }

  onCancelClick() {
    this.onCancel();
  }

  onDeleteClick() {
    this.onDelete();
  }

  addPredecessor(): void {
    this.predecessors.push({
      linkId: null,
      sourceId: null,
      sourceName: '',
      type: '0',
      lag: 0,
    });
  }

  removePredecessor(index: number): void {
    this.predecessors.splice(index, 1);
  }

  onPredecessorTaskChange(index: number, taskId: string | number): void {
    const row = this.predecessors[index];
    if (taskId) {
      const task = this.availableTasks.find(t => t.id == taskId);
      row.sourceId = taskId;
      row.sourceName = task?.text || `Task ${taskId}`;
    } else {
      row.sourceId = null;
      row.sourceName = '';
    }
  }

  private initPredecessors(): void {
    const allLinks: (Link | SerializedLink)[] = this.gantt
      .getDatastore('link')
      .getItems()
      .filter((l) => String((l as Link).target) === String(this.data.id)) as Link[];

    this.predecessors = allLinks.map((link: Link | SerializedLink) => {
      const sourceTask: Task = this.gantt.getTask(link.source);
      return {
        linkId: link.id,
        sourceId: link.source,
        sourceName: sourceTask.text || `Task ${link.source}`,
        type: String(link.type),
        lag: link.lag || 0,
      };
    });
  }

  private initAvailableTasks(): void {
    this.availableTasks = [];
    const currentId = this.data.id;
    const excludeIds = new Set<string | number>();
    excludeIds.add(currentId);

    if (this.gantt.hasChild(currentId)) {
      this.gantt.eachTask((child: Task) => {
        excludeIds.add(child.id);
      }, currentId);
    }

    this.gantt.eachTask((task: Task) => {
      if (!excludeIds.has(task.id)) {
        this.availableTasks.push({ id: task.id, text: task.text || `Task ${task.id}` });
      }
    });
  }

  private applyLinkChanges(): void {
    const taskId = this.data.id;

    // Collect IDs of links still present in the edited list
    const editedLinkIds = new Set<string | number>();
    for (const row of this.predecessors) {
      if (row.linkId != null) {
        editedLinkIds.add(row.linkId);
      }
    }

    // Find original links targeting this task
    const originalLinks: Link[] = this.gantt
      .getDatastore('link')
      .getItems()
      .filter((l) => String((l as Link).target) === String(taskId)) as Link[];

    // Links removed from the editor
    const toDelete: (string | number)[] = [];
    for (const link of originalLinks) {
      if (!editedLinkIds.has(link.id)) {
        toDelete.push(link.id);
      }
    }

    // Links to update (existing) or add (new)
    const toUpdate: { id: string | number; source: string | number; type: string; lag: number }[] = [];
    const toAdd: { source: string | number; target: string | number; type: string; lag: number }[] = [];

    for (const row of this.predecessors) {
      if (row.sourceId == null) {
        continue;
      }
      if (row.linkId != null) {
        // Existing link — update with current values
        toUpdate.push({
          id: row.linkId,
          source: row.sourceId,
          type: row.type,
          lag: row.lag || 0,
        });
      } else {
        // New row — add a new link
        toAdd.push({
          source: row.sourceId,
          target: taskId,
          type: row.type,
          lag: row.lag || 0,
        });
      }
    }

    const hasChanges = toDelete.length || toAdd.length || toUpdate.length;
    if (hasChanges) {
      this.gantt.batchUpdate(() => {
        for (const linkId of toDelete) {
          this.gantt.deleteLink(linkId);
        }
        for (const upd of toUpdate) {
          const link = this.gantt.getLink(upd.id);
          link.source = upd.source;
          link.type = upd.type;
          link.lag = upd.lag;
          this.gantt.updateLink(upd.id);
        }
        for (const link of toAdd) {
          this.gantt.addLink(link);
        }

        this.gantt.autoSchedule();
      });
    }
  }

  private dateToString(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private stringToDate(s: string): Date {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
}
