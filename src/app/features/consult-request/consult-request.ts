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
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

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
  }

  goBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    if (this.consultForm.invalid) return;

    this.isSubmitting = true;
    this.submitError = '';
    this.cdr.detectChanges();
    
    this.http.post('http://localhost:5016/api/consultations/request', this.consultForm.value).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.message || 'Something went wrong. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }
}
