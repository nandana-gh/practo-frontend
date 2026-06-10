import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DoctorService, DoctorProfileDto } from '../../../core/services/doctor.service';
import { BookingWidgetComponent } from '../booking-widget/booking-widget';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, BookingWidgetComponent],
  templateUrl: './doctor-profile.html',
  styleUrls: ['./doctor-profile.css']
})
export class DoctorProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private doctorService = inject(DoctorService);
  private cdr = inject(ChangeDetectorRef);

  doctorId!: number;
  profile!: DoctorProfileDto;
  loading = true;
  error = '';

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.doctorId = +id;
        this.fetchProfile();
      }
    });
  }

  fetchProfile() {
    this.loading = true;
    this.doctorService.getDoctorProfile(this.doctorId).subscribe({
      next: (res) => {
        this.profile = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load doctor profile. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}

