import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup').then(m => m.SignupComponent)
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search-results/search-results').then(m => m.SearchResultsComponent)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./features/profile/doctor-profile/doctor-profile').then(m => m.DoctorProfileComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
