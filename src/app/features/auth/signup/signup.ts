import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from '../../../shared/components/header/header';
import { FooterComponent } from '../../../shared/components/footer/footer';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);

  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  role = 0; // 0 = Patient, 1 = Doctor
  experienceYears: number | null = null;
  videoConsultationFee: number | null = null;
  
  errorMessage = '';
  isLoading = false;

  // OTP State
  showOtpModal = false;
  otpCode = '';
  otpError = '';
  otpLoading = false;

  onSubmit(): void {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Split Full Name into FirstName and LastName
    const nameParts = this.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '.';

    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      password: this.password,
      role: Number(this.role),
      experienceYears: Number(this.role) === 1 ? (this.experienceYears || 0) : null,
      videoConsultationFee: Number(this.role) === 1 ? (this.videoConsultationFee || 0) : null
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.showOtpModal = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to register. Please try again.';
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

    this.authService.verifyOtp(this.email, this.otpCode).subscribe({
      next: (res) => {
        this.otpLoading = false;
        this.showOtpModal = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.otpLoading = false;
        this.otpError = err.error?.message || 'Invalid or expired OTP code';
      }
    });
  }

  onResendOtp(): void {
    this.authService.sendOtp(this.email).subscribe({
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
    this.router.navigate(['/login']);
  }
}
