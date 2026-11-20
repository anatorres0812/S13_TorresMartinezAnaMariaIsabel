
import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Layout } from './components/layout/layout';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  // Login público
  {
    path: 'login',
    component: Login
  },

  // Panel protegido con menú lateral
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },

      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio/inicio')
            .then(m => m.Inicio)
      },

      {
        path: 'habitaciones',
        loadComponent: () =>
          import('./pages/habitaciones/habitaciones')
            .then(m => m.Habitaciones)
      },

      {
        path: 'huespedes',
        loadComponent: () =>
          import('./pages/huespedes/huespedes')
            .then(m => m.Huespedes)
      },

      {
        path: 'reservas',
        loadComponent: () =>
          import('./pages/reservas/reservas')
            .then(m => m.Reservas)
      },

      {
        path: '**',
        redirectTo: 'inicio'
      }

    ]
  }

];
