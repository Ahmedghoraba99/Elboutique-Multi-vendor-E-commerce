import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './Auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    title: 'Elboutique',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  {
    path: '**',
    title: 'Page not found',
    component: PageNotFoundComponent,
  },
];
