import { Routes } from '@angular/router';

const supportPage = () => import('./support-page/support-page').then((m) => m.SupportPage);

export const supportRoutes: Routes = [
  { path: '', loadComponent: supportPage, title: 'NextCar - Soporte' }
];
