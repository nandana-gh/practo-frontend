import { Component, Input, OnInit, inject } from '@angular/core';
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
      },
      error: () => {
        this.loading = false;
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
    // In a real app, we would pass the selected time and date to a booking confirmation page
    // For now, we will simulate the navigation
    const selectedDate = this.slots[this.selectedDateIndex].date;
    alert(`Redirecting to checkout for slot: ${new Date(selectedDate).toDateString()} at ${time}`);
    // this.router.navigate(['/checkout'], { queryParams: { doctorId: this.doctorId, time: time, date: selectedDate } });
  }
}
