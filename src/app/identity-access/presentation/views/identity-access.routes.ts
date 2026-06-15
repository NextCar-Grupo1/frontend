import { Routes } from '@angular/router';

const loginPage = () => import('./login-page/login-page').then((m) => m.LoginPage);
const registerPage = () => import('./register-page/register-page').then((m) => m.RegisterPage);

export const identityAccessRoutes: Routes = [
  { path: 'login', loadComponent: loginPage, title: 'NextCar - Iniciar sesion' },
  { path: 'register', loadComponent: registerPage, title: 'NextCar - Registro' },
  { path: '', pathMatch: 'full', redirectTo: 'login' }
];
