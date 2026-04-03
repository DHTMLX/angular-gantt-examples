import { Routes } from '@angular/router';
import { BasicInitializationComponent } from './samples/basic-initialization/basic-initialization';
import { ConfigsAndTemplatesComponent } from './samples/configs-and-templates/configs-and-templates';
import { AutoSchedulingComponent } from './samples/auto-scheduling/auto-scheduling';
import { ResourcePanelComponent } from './samples/resource-panel/resource-panel';
import { CalendarsComponent } from './samples/calendars/calendars';
import { EditorComponent } from './samples/inline-editors/inline-editors';
import { CustomFormComponent } from './samples/custom-form/custom-form';
import { AdvancedFormSampleComponent } from './samples/advanced-form/advanced-form';
import { TemplateComponentsComponent } from './samples/template-components/template-components';
import { StateManagementComponent } from './samples/state-management/state-management';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'basic' },
  { path: 'basic', component: BasicInitializationComponent },
  { path: 'configs-templates', component: ConfigsAndTemplatesComponent },
  { path: 'auto-scheduling', component: AutoSchedulingComponent },
  { path: 'resource-panel', component: ResourcePanelComponent },
  { path: 'calendars', component: CalendarsComponent },
  { path: 'inline-editors', component: EditorComponent },
  { path: 'custom-form', component: CustomFormComponent },
  { path: 'advanced-form', component: AdvancedFormSampleComponent },
  { path: 'template-components', component: TemplateComponentsComponent },
  { path: 'state-management', component: StateManagementComponent },
  { path: '**', redirectTo: 'basic' },
]; 
