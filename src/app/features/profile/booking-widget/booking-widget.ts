import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorService, AppointmentSlotDto, ClinicDto } from '../../../core/services/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-widget.html',
  styleUrls: ['./booking-widget.css']
})
export class BookingWidgetComponent implements OnInit {
  @Input() doctorId!: number;
  @Input() clinics!: ClinicDto[];

  private doctorService = inject(DoctorService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  activeTab: 'clinic' | 'video' = 'clinic';
  selectedClinicId?: number;
  
  slots: AppointmentSlotDto[] = [];
  loading = false;
  
  selectedDateIndex = 0;

  ngOnInit() {
    if (this.clinics && this.clinics.length > 0) {
      this.selectedClinicId = this.clinics[0].id;
    }
    this.fetchSlots();
  }

  fetchSlots() {
    this.loading = true;
    this.doctorService.getDoctorAvailability(this.doctorId, this.selectedClinicId, undefined, 3).subscribe({
      next: (res) => {
        this.slots = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  switchTab(tab: 'clinic' | 'video') {
    this.activeTab = tab;
    // For video consults, clinicId might not be necessary, but we fetch slots anyway
    this.fetchSlots();
  }

  changeClinic(event: any) {
    this.selectedClinicId = +event.target.value;
    this.fetchSlots();
  }

  selectDate(index: number) {
    this.selectedDateIndex = index;
  }

  bookSlot(time: string) {
    const selectedDate = this.slots[this.selectedDateIndex].date;
    this.router.navigate(['/book', this.doctorId], { 
      queryParams: { 
        time: time, 
        date: selectedDate,
        type: this.activeTab === 'clinic' ? 'InClinic' : 'Video',
        clinicId: this.activeTab === 'clinic' ? this.selectedClinicId : undefined
      } 
    });
  }
}

