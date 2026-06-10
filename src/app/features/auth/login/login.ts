import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from '../../../shared/components/header/header';
import { FooterComponent } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // OTP State
  showOtpModal = false;
  otpCode = '';
  otpEmail = '';
  otpError = '';
  otpLoading = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.role === 'Doctor') {
          this.router.navigate(['/doctor/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 403 && err.error?.requiresVerification) {
          this.otpEmail = err.error.email;
          this.showOtpModal = true;
        } else {
          this.errorMessage = err.error?.message || 'Invalid email or password';
        }
      }
    });
  }

  onVerifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.otpError = 'Please enter a valid 6-digit OTP code';
      return;
    }

    this.otpLoading = true;
    this.otpError = '';

    this.authService.verifyOtp(this.otpEmail, this.otpCode).subscribe({
      next: (res) => {
        this.otpLoading = false;
        this.showOtpModal = false;
        if (res.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (res.role === 'Doctor') {
          this.router.navigate(['/doctor/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.otpLoading = false;
        this.otpError = err.error?.message || 'Invalid or expired OTP code';
      }
    });
  }

  onResendOtp(): void {
    this.authService.sendOtp(this.otpEmail).subscribe({
      next: () => {
        alert('A new OTP has been sent to your email.');
      },
      error: (err) => {
        this.otpError = err.error?.message || 'Failed to resend OTP. Please try again.';
      }
    });
  }

  closeOtpModal(): void {
    this.showOtpModal = false;
    this.otpCode = '';
    this.otpError = '';
  }
}


