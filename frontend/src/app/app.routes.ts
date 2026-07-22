import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'cv/new',
        pathMatch: 'full'
      },
      {
        path: 'cv/new',
        loadComponent: () => import('./features/cv/cv-editor.component').then(m => m.CvEditorComponent)
      },
      {
        path: 'cv/:id',
        loadComponent: () => import('./features/cv/cv-editor.component').then(m => m.CvEditorComponent)
      },
      {
        path: 'cv/:id/preview',
        loadComponent: () => import('./features/cv-preview/cv-preview.component').then(m => m.CvPreviewComponent)
      }
    ]
  }
];
