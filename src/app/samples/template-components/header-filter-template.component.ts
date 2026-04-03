import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dhx-header-filter-template',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header-filter-root">
      <button type="button" class="header-filter-trigger" (click)="toggleMenu($event)">
        Show: {{ currentFilterLabel }}
      </button>

      <div class="header-filter-menu" *ngIf="menuOpen">
        <button type="button" (click)="select('done', $event)">Show Done</button>
        <button type="button" (click)="select('notDone', $event)">Show Not Done</button>
        <button type="button" (click)="select('all', $event)">Show All</button>
      </div>
    </div>
  `,
  styles: [`
    .header-filter-root {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      text-align: center;
      line-height: 20px;
    }

    .header-filter-trigger {
      border: 0;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 12px;
      font-weight: 600;
      background: #f2f6f9;
      color: #1c2b36;
      cursor: pointer;
    }

    .header-filter-menu {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      z-index: 10;
      display: flex;
      flex-direction: column;
      background: #fff;
      border: 1px solid #d9dee3;
      border-radius: 6px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }

    .header-filter-menu button {
      border: 0;
      background: transparent;
      padding: 6px 8px;
      text-align: left;
      cursor: pointer;
      font-size: 12px;
    }

    .header-filter-menu button:hover {
      background: #f4f7fa;
    }
  `],
})
export class HeaderFilterTemplateComponent {
  @Input() currentFilterLabel = 'All';
  @Input() onFilterSelected: ((filterType: string) => void) | null = null;

  menuOpen = false;

  toggleMenu(event?: Event): void {
    event?.stopPropagation();
    this.menuOpen = !this.menuOpen;
  }

  select(filterType: string, event?: Event): void {
    event?.stopPropagation();
    this.menuOpen = false;
    this.onFilterSelected?.(filterType);
  }
}
