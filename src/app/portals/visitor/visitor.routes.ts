import { Routes } from '@angular/router';

export const visitorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./visitor-shell.component').then(m => m.VisitorShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./visitor-dashboard/visitor-dashboard.component').then(m => m.VisitorDashboardComponent)
      },
      {
        path: 'claim',
        loadComponent: () => import('./claim/claim.component').then(m => m.ClaimComponent)
      }
    ]
  }
];
