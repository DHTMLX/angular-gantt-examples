import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

const hasEmbeddedMode = (search: string) => new URLSearchParams(search).get('mode') === 'embed';

const isEmbeddedMode = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const hashQueryIndex = window.location.hash.indexOf('?');
  const hashQuery = hashQueryIndex > -1 ? window.location.hash.slice(hashQueryIndex + 1) : '';

  return hasEmbeddedMode(window.location.search) || hasEmbeddedMode(hashQuery);
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('samples-public');
  protected readonly embedded = signal(isEmbeddedMode());
}
