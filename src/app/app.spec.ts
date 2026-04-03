import { App } from './app';

describe('App', () => {
  it('creates the app class instance', () => {
    const app = new App();
    expect(app).toBeTruthy();
  });

  it('keeps the default title signal value', () => {
    const app = new App();
    expect((app as any).title()).toBe('samples-public');
  });
});
