import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LabTestsService, LabTestsLandingDto } from '../../core/services/lab-tests';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-lab-tests-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lab-tests-landing.html',
  styleUrls: ['./lab-tests-landing.css']
})
export class LabTestsLandingComponent implements OnInit {
  landingData: LabTestsLandingDto | null = null;
  loading = true;
  error = '';

  constructor(private labTestsService: LabTestsService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.labTestsService.getLandingData().subscribe({
      next: (data) => {
        this.landingData = data;
        this.loading = false;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching lab tests:', err);
        this.error = 'Failed to load lab tests data. Please check your backend connection.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
