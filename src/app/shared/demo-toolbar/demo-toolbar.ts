import { Component, Input } from '@angular/core';

@Component({
  selector: 'dhx-demo-toolbar',
  standalone: true,
  templateUrl: './demo-toolbar.html',
})
export class DemoToolbarComponent {
  @Input({ required: true }) title!: string;
}
