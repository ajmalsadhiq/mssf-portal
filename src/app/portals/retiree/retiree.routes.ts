import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const retireeRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./retiree-shell.component').then(m => m.RetireeShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./appointments/appointments.component').then(m => m.AppointmentsComponent)
      },
      {
        path: 'bank',
        loadComponent: () => import('./bank/bank.component').then(m => m.BankComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'certificates',
        loadComponent: () => import('./certificates/certificates.component').then(m => m.CertificatesComponent)
      },
      {
        path: 'chat',
        loadComponent: () => import('./chat/chat.component').then(m => m.ChatComponent)
      }
    ]
  }
];
