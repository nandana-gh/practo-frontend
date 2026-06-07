import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-software-clinics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './software-clinics.html',
  styleUrls: ['./software-clinics.css']
})
export class SoftwareClinicsComponent implements OnInit {
  leadForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;

  faqs: Faq[] = [
    { question: "Is Practo Ray completely cloud-based?", answer: "Yes, Practo Ray is 100% cloud-based, meaning you can access it from anywhere." },
    { question: "How do I add a signature to a print format?", answer: "You can upload your digitized signature in the Settings panel." },
    { question: "Does SMS generation depend on an internet connection?", answer: "Yes, an internet connection is required to sync and trigger SMS." },
    { question: "How do I configure SMS language?", answer: "SMS language can be configured under Communications Settings." },
    { question: "Addition of new EMH fields to Patient details.", answer: "Custom EMH fields can be added via the Patient Profile settings." },
    { question: "How to edit SMS content templates?", answer: "SMS templates are editable under the Settings > Communications tab." },
    { question: "How to view billing history?", answer: "Billing history is accessible in the Reports & Billing tab." },
    { question: "How to add new doctors/staff to a clinic?", answer: "Administrators can add staff via Settings > User Management." },
    { question: "How to print a prescription?", answer: "Click 'Print' on the prescription screen." }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.leadForm = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: ['', Validators.required],
      speciality: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchFaqs();
  }

  fetchFaqs(): void {
    this.http.get<Faq[]>('http://localhost:5016/api/software/faqs').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.faqs = data;
        }
      },
      error: (err) => console.error('Failed to fetch FAQs', err)
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
    this.submitSuccess = false;

    this.http.post('http://localhost:5016/api/providers/join', this.leadForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        this.leadForm.reset();
      },
      error: (err) => {
        console.error('Submission failed', err);
        this.isSubmitting = false;
      }
    });
  }
}
