import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'medicines',
    loadComponent: () => import('./features/medicines-landing/medicines-landing').then(m => m.MedicinesLandingComponent)
  },
  {
    path: 'lab-tests',
    loadComponent: () => import('./features/lab-tests-landing/lab-tests-landing').then(m => m.LabTestsLandingComponent)
  },
  {
    path: '',
    loadComponent: () => import('./features/main-landing/main-landing').then(m => m.MainLandingComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent)
  },
  {
    path: 'find-doctors',
    loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
  },
  {
    path: 'surgeries',
    loadComponent: () => import('./features/landing/landing').then(m => m.LandingComponent)
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
    path: 'video-consult',
    loadComponent: () => import('./features/video-consult/video-consult').then(m => m.VideoConsultComponent)
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./features/profile/doctor-profile/doctor-profile').then(m => m.DoctorProfileComponent)
  },
  {
    path: 'patient/dashboard',
    loadComponent: () => import('./features/patient-dashboard/patient-dashboard').then(m => m.PatientDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'doctor/dashboard',
    loadComponent: () => import('./features/doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'consult/request',
    loadComponent: () => import('./features/consult-request/consult-request').then(m => m.ConsultRequestComponent)
  },
  {
    path: 'book/:doctorId',
    loadComponent: () => import('./features/book-appointment/book-appointment').then(m => m.BookAppointmentComponent),
    canActivate: [authGuard]
  },
  {
    path: 'consult/:id',
    loadComponent: () => import('./features/teleconsult-room/teleconsult-room').then(m => m.TeleconsultRoomComponent),
    canActivate: [authGuard]
  },
  {
    path: 'corporate',
    loadComponent: () => import('./features/corporate-landing/corporate-landing').then(m => m.CorporateLandingComponent)
  },
  {
    path: 'providers/prime',
    loadComponent: () => import('./features/practo-prime/practo-prime').then(m => m.PractoPrimeComponent)
  },
  {
    path: 'data-security',
    loadComponent: () => import('./features/data-security/data-security').then(m => m.DataSecurityComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about-practo/about-practo').then(m => m.AboutPractoComponent)
  },
  {
    path: 'software/clinics',
    loadComponent: () => import('./features/software-clinics/software-clinics').then(m => m.SoftwareClinicsComponent)
  },
  {
    path: 'software/hospitals',
    loadComponent: () => import('./features/software-hospitals/software-hospitals').then(m => m.SoftwareHospitalsComponent)
  },
  {
    path: 'providers/profile',
    loadComponent: () => import('./features/practo-profile/practo-profile').then(m => m.PractoProfileComponent)
  },
  {
    path: 'help',
    loadComponent: () => import('./features/help/help').then(m => m.HelpComponent)
  },

  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: '**',
    redirectTo: ''
  }
];

