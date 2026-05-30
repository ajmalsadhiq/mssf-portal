import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./portals/public/public.routes').then(m => m.publicRoutes)
  },
  {
    path: 'retiree',
    loadChildren: () => import('./portals/retiree/retiree.routes').then(m => m.retireeRoutes)
  },
  {
    path: 'visitor',
    loadChildren: () => import('./portals/visitor/visitor.routes').then(m => m.visitorRoutes)
  },
  {
    path: 'company',
    loadChildren: () => import('./portals/company/company.component').then(m => m.companyRoutes)
  },
  {
    path: 'bank',
    loadChildren: () => import('./portals/bank/bank.component').then(m => m.bankRoutes)
  },
  {
    path: 'ministry',
    loadChildren: () => import('./portals/ministry/ministry.component').then(m => m.ministryRoutes)
  },
  {
    path: 'court',
    loadChildren: () => import('./portals/court/court.component').then(m => m.courtRoutes)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
