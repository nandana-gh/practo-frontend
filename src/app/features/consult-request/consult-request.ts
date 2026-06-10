import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-consult-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './consult-request.html',
  styleUrls: ['./consult-request.css']
})
export class ConsultRequestComponent implements OnInit {
  consultForm!: FormGroup;
  otpForm!: FormGroup;

  step: 'details' | 'otp' | 'success' = 'details';
  
  isSubmitting = false;
  submitError = '';

  isVerifying = false;
  verifyError = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.consultForm = this.fb.group({
      symptom: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  goBack(): void {
    if (this.step === 'otp') {
      this.step = 'details';
      this.submitError = '';
      this.verifyError = '';
      this.cdr.detectChanges();
    } else {
      this.location.back();
    }
  }

  onSubmit(): void {
    if (this.consultForm.invalid) return;

    this.isSubmitting = true;
    this.submitError = '';
    this.cdr.detectChanges();
    
    this.http.post('http://4.187.152.228:5000/api/consultations/request', this.consultForm.value).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.step = 'otp';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.message || 'Something went wrong. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  onVerifyOtp(): void {
    if (this.otpForm.invalid) return;

    this.isVerifying = true;
    this.verifyError = '';
    this.cdr.detectChanges();

    const payload = {
      email: this.consultForm.value.email,
      otp: this.otpForm.value.otp
    };

    this.http.post('http://4.187.152.228:5000/api/consultations/verify-otp', payload).subscribe({
      next: (res: any) => {
        this.isVerifying = false;
        this.step = 'success';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isVerifying = false;
        this.verifyError = err.error?.message || 'Invalid OTP. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}

