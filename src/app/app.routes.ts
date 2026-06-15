import { Routes } from '@angular/router';
import { authGuard } from './identity-access/application/auth.guard';

const appShell = () => import('./shared/presentation/components/app-shell/app-shell').then((m) => m.AppShell);
const identityAccessRoutes = () => import('./identity-access/presentation/views/identity-access.routes').then((m) => m.identityAccessRoutes);
const financingRoutes = () => import('./financing/presentation/views/financing.routes').then((m) => m.financingRoutes);
const supportRoutes = () => import('./support/presentation/views/support.routes').then((m) => m.supportRoutes);
const profilePage = () => import('./identity-access/presentation/views/profile-page/profile-page').then((m) => m.ProfilePage);

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: identityAccessRoutes
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: appShell,
    children: [
      {
        path: '',
        loadChildren: financingRoutes
      },
      {
        path: 'profile',
        loadComponent: profilePage,
        title: 'NextCar - Mi perfil'
      },
      {
        path: 'support',
        loadChildren: supportRoutes
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
