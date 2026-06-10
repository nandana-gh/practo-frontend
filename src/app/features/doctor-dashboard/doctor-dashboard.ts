import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css']
})
export class DoctorDashboardComponent implements OnInit {
  activeTab: 'calendar' | 'patients' | 'reports' | 'profile' = 'calendar';
  isLoading = true;
  authService = inject(AuthService);
  
  // Data models
  appointments: any[] = [];
  calendarSlots: any[] = [];
  patients: any[] = [];
  reports: any | null = null;
  profileForm: any = {
    qualifications: '',
    experienceYears: 0,
    registrationNumber: '',
    languagesSpoken: '',
    about: '',
    videoConsultationFee: 0
  };

  profileSaveMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadActiveTabData();
  }

  get doctorId(): number {
    return this.authService.currentUser()?.userId || 0;
  }

  setTab(tab: 'calendar' | 'patients' | 'reports' | 'profile') {
    this.activeTab = tab;
    this.loadActiveTabData();
  }

  loadActiveTabData() {
    this.isLoading = true;
    this.cdr.detectChanges();

    if (this.activeTab === 'calendar') {
      // Load both appointments and availability
      this.http.get<any[]>(`/api/Appointment/doctor`).subscribe({
        next: (data) => {
          this.appointments = data;
          this.loadAvailability();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.activeTab === 'patients') {
      this.http.get<any[]>(`/api/Doctor/user/${this.doctorId}/patients`).subscribe({
        next: (data) => {
          this.patients = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.activeTab === 'reports') {
      this.http.get<any>(`/api/Doctor/user/${this.doctorId}/reports`).subscribe({
        next: (data) => {
          this.reports = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else if (this.activeTab === 'profile') {
      this.http.get<any>(`/api/Doctor/user/${this.doctorId}/profile`).subscribe({
        next: (data) => {
          if (data) {
            this.profileForm = {
              qualifications: data.qualifications || '',
              experienceYears: data.experienceYears || 0,
              registrationNumber: data.registrationNumber || '',
              languagesSpoken: data.languagesSpoken || '',
              about: data.about || '',
              videoConsultationFee: data.videoConsultationFee || 0,
              clinics: data.clinics || []
            };
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadAvailability() {
    this.http.get<any[]>(`/api/Doctor/user/${this.doctorId}/availability?days=3`).subscribe({
      next: (data) => {
        this.calendarSlots = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveProfile() {
    this.isLoading = true;
    this.profileSaveMessage = '';
    
    this.http.put(`/api/Doctor/user/${this.doctorId}/profile`, this.profileForm).subscribe({
      next: () => {
        this.isLoading = false;
        this.profileSaveMessage = 'Profile updated successfully!';
        setTimeout(() => {
          this.profileSaveMessage = '';
          this.cdr.detectChanges();
        }, 3000);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.profileSaveMessage = 'Failed to update profile.';
        this.cdr.detectChanges();
      }
    });
  }

  newClinic = {
    name: '',
    address: '',
    city: '',
    locality: '',
    timings: '',
    consultationFee: 500
  };
  clinicSaveMessage = '';

  addClinic() {
    if (!this.newClinic.name || !this.newClinic.address || !this.newClinic.city) {
      this.clinicSaveMessage = 'Please fill out required fields (Name, Address, City).';
      return;
    }

    this.isLoading = true;
    this.http.post(`/api/Doctor/user/${this.doctorId}/clinics`, this.newClinic).subscribe({
      next: () => {
        this.isLoading = false;
        this.clinicSaveMessage = 'Clinic added successfully!';
        // Reset form
        this.newClinic = { name: '', address: '', city: '', locality: '', timings: '', consultationFee: 500 };
        // Reload profile to get new clinic list
        this.loadActiveTabData();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        this.clinicSaveMessage = 'Failed to add clinic.';
        this.cdr.detectChanges();
      }
    });
  }
}


