import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  { path: '', loadComponent: async () => (await import('./pages/home/home.page')).HomePageComponent }
];