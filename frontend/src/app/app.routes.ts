import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'cv',
        pathMatch: 'full'
      },
      {
        path: 'cv',
        loadComponent: () => import('./features/cv/cv-editor.component').then(m => m.CvEditorComponent)
      }
    ]
  }
];
