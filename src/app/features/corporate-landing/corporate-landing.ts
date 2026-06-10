import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-corporate-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './corporate-landing.html',
  styleUrls: ['./corporate-landing.css']
})
export class CorporateLandingComponent implements OnInit {
  demoForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.demoForm = this.fb.group({
      name: ['', Validators.required],
      organizationName: ['', Validators.required],
      officialEmailId: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      organizationSize: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Component initialization
  }

  onSubmit(): void {
    if (this.demoForm.invalid) {
      Object.keys(this.demoForm.controls).forEach(key => {
        this.demoForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = '';

    this.http.post('/api/corporate/demo', this.demoForm.value)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.submitSuccess = true;
          this.demoForm.reset();
        },
        error: (err) => {
          console.error('Error submitting demo request', err);
          this.submitError = 'Failed to submit the demo request. Please try again.';
        }
      });
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}


