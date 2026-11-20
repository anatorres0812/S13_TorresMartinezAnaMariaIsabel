import { Routes } from '@angular/router';

import { Layout } from './components/layout/layout';
import { Inicio } from './pages/inicio/inicio';
import { Habitaciones } from './pages/habitaciones/habitaciones';
import { Huespedes } from './pages/huespedes/huespedes';
import { Reservas } from './pages/reservas/reservas';
import { NoEncontrado } from './pages/no-encontrado/no-encontrado';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
      },
      {
        path: 'inicio',
        component: Inicio
      },
      {
        path: 'habitaciones',
        component: Habitaciones
      },
      {
        path: 'huespedes',
        component: Huespedes
      },
      {
        path: 'reservas',
        component: Reservas
      }
    ]
  },
  {
    path: '**',
    component: NoEncontrado
  }
];