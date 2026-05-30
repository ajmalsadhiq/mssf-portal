import { Routes } from '@angular/router';

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./public-shell.component').then(m => m.PublicShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./services/services.component').then(m => m.ServicesComponent)
      },
      {
        path: 'news',
        loadComponent: () => import('./news/news.component').then(m => m.NewsComponent)
      },
      {
        path: 'calculator',
        loadComponent: () => import('./calculator/calculator.component').then(m => m.CalculatorComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./contact/contact.component').then(m => m.ContactComponent)
      }
    ]
  }
];
