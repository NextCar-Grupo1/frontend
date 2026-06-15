import { Routes } from '@angular/router';

const dashboardPage = () => import('./dashboard-page/dashboard-page').then((m) => m.DashboardPage);
const simulatorPage = () => import('./simulator-page/simulator-page').then((m) => m.SimulatorPage);
const resultsPage = () => import('./results-page/results-page').then((m) => m.ResultsPage);
const creditsPage = () => import('./credits-page/credits-page').then((m) => m.CreditsPage);

export const financingRoutes: Routes = [
  { path: 'dashboard', loadComponent: dashboardPage, title: 'NextCar - Dashboard' },
  { path: 'simulator', loadComponent: simulatorPage, title: 'NextCar - Simulador' },
  { path: 'simulator/:id', loadComponent: simulatorPage, title: 'NextCar - Editar simulacion' },
  { path: 'results/:id', loadComponent: resultsPage, title: 'NextCar - Resultados' },
  { path: 'credits', loadComponent: creditsPage, title: 'NextCar - Mis creditos' },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];
