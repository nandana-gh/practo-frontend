import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SurgeryService, SurgeryCategoryDto, SurgeryTreatmentDto } from '../../core/services/surgery';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements OnInit {
  categories: SurgeryCategoryDto[] = [];
  popularTreatments: SurgeryTreatmentDto[] = [];
  
  leadForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(
    private surgeryService: SurgeryService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.leadForm = this.fb.group({
      surgeryName: ['', Validators.required],
      city: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit(): void {
    this.surgeryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.filter(c => c.name !== 'Popular');
        
        const popCategory = data.find(c => c.name === 'Popular');
        if (popCategory) {
          this.popularTreatments = popCategory.treatments;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        this.cdr.detectChanges();
      }
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
    this.submitError = '';
    this.submitSuccess = false;

    this.surgeryService.submitLead(this.leadForm.value)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.submitSuccess = true;
          this.leadForm.reset();
        },
        error: () => {
          this.submitError = 'Failed to submit request. Please try again.';
        }
      });
  }

  getTreatmentImage(name: string): string {
    // Return a dummy image if image doesn't exist
    return `assets/images/treatments/${name.toLowerCase().replace(/ /g, '-')}.png`;
  }
}

