import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-practo-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './practo-profile.html',
  styleUrls: ['./practo-profile.css']
})
export class PractoProfileComponent implements OnInit {
  leadForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  
  showOtpStep = false;
  otpCode = '';
  otpError = '';
  otpLoading = false;
  
  errorMessage = '';
  specialties: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.leadForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.email]], // Email field
      password: ['', [Validators.required, Validators.minLength(6)]],
      specialtyId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchSpecialties();
  }

  fetchSpecialties(): void {
    this.http.get('http://localhost:5016/api/search/specialties?limit=100').subscribe({
      next: (res: any) => {
        this.specialties = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load specialties', err)
    });
  }

  onSubmit(): void {
    if (this.leadForm.invalid) {
      Object.keys(this.leadForm.controls).forEach(key => {
        this.leadForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http.post('http://localhost:5016/api/providers/profile-lead', this.leadForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showOtpStep = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Submission failed', err);
        this.errorMessage = err.error?.message || 'Failed to send OTP. Please try again.';
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }

  onVerifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.otpError = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.otpLoading = true;
    this.otpError = '';
    this.cdr.detectChanges();

    const payload = {
      name: this.leadForm.value.name,
      email: this.leadForm.value.phone,
      password: this.leadForm.value.password,
      specialtyId: parseInt(this.leadForm.value.specialtyId, 10),
      otp: this.otpCode
    };

    this.http.post('http://localhost:5016/api/providers/register-doctor', payload).subscribe({
      next: () => {
        this.otpLoading = false;
        this.showOtpStep = false;
        this.submitSuccess = true;
        this.leadForm.reset();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.otpLoading = false;
        this.otpError = err.error?.message || 'Invalid OTP. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
