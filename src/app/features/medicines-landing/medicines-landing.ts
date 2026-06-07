import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MedicineService, MedicinesLandingDto } from '../../core/services/medicine';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-medicines-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicines-landing.html',
  styleUrls: ['./medicines-landing.css']
})
export class MedicinesLandingComponent implements OnInit {
  landingData: MedicinesLandingDto | null = null;
  loading = true;
  error = '';

  constructor(private medicineService: MedicineService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.medicineService.getLandingData().subscribe({
      next: (data) => {
        this.landingData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching medicines:', err);
        this.error = 'Failed to load medicines data. Please check your backend connection.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper arrays for splitting product stars/ratings (optional visual detail)
  getArray(num: number) {
    return new Array(num);
  }
}
