import { describe, expect, it, vi } from 'vitest';

import { isAngularTemplateRenderable } from '@dhtmlx/trial-angular-gantt';

import { routes } from '../../app.routes';
import { TemplateComponentsComponent } from './template-components';

describe('TemplateComponents sample', () => {
  it('registers template-components route', () => {
    const route = routes.find((entry) => entry.path === 'template-components');
    expect(route?.component).toBe(TemplateComponentsComponent);
  });

  it('provides Angular component descriptors for header, grid cell and task templates', () => {
    const component = new TemplateComponentsComponent();
    const fakeTask = { id: 1, text: 'Task', completed: false };

    const taskTextTemplateResult = component.templates.task_text?.(
      new Date(),
      new Date(),
      fakeTask
    );

    const customColumn = component.config.columns.find((column: any) => column.name === 'custom');
    const headerTemplateResult = customColumn?.label;
    const cellTemplateResult = customColumn?.template?.(fakeTask);

    expect(isAngularTemplateRenderable(taskTextTemplateResult)).toBe(true);
    expect(isAngularTemplateRenderable(headerTemplateResult)).toBe(true);
    expect(isAngularTemplateRenderable(cellTemplateResult)).toBe(true);
  });

  it('keeps stable config and templates references', () => {
    const component = new TemplateComponentsComponent();

    const configRef = component.config;
    const templatesRef = component.templates;

    expect(component.config).toBe(configRef);
    expect(component.templates).toBe(templatesRef);
  });

  it('updates only custom header label descriptor on filter change', () => {
    const component = new TemplateComponentsComponent();
    const renderSpy = vi.fn();
    (component as any).ganttInstance = { render: renderSpy };

    const configRef = component.config;
    const customColumn = configRef.columns.find((column: any) => column.name === 'custom');
    const oldLabel = customColumn?.label;

    (component as any).handleFilterSelected('done');

    expect(component.config).toBe(configRef);
    expect(customColumn?.label).not.toBe(oldLabel);
    expect(customColumn?.label?.inputs?.currentFilterLabel).toBe('Done');
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
