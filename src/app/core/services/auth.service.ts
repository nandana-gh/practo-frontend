import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';

export interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Patient' | 'Doctor' | 'Admin';
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5016/api/auth';

  // Reactive state using Angular signals
  private currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly userRole = computed(() => this.currentUserSignal()?.role || null);

  constructor() {
    this.loadToken();
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  verifyOtp(email: string, otpCode: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-otp`, { email, otpCode }).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(this.handleError)
    );
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('practo_token');
    localStorage.removeItem('practo_user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem('practo_token', response.token);
    const user: User = {
      userId: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role as any
    };
    localStorage.setItem('practo_user', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private loadToken(): void {
    const token = localStorage.getItem('practo_token');
    const userJson = localStorage.getItem('practo_user');
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSignal.set(user);
      } catch {
        this.logout();
      }
    }
  }

  getToken(): string | null {
    return localStorage.getItem('practo_token');
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }
}
