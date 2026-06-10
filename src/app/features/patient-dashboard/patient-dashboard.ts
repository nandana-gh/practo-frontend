import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-dashboard.html'
})
export class PatientDashboardComponent implements OnInit {
  appointments: any[] = [];
  medicineOrders: any[] = [];
  medicalRecords: any[] = [];
  prescriptions: any[] = [];
  isLoading = true;
  activeTab: 'appointments' | 'medicines' | 'records' = 'appointments';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<any[]>(`http://4.187.152.228:5000/api/Appointment/patient`).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    this.http.get<any[]>(`http://4.187.152.228:5000/api/Medicines/orders`).subscribe({
      next: (data) => {
        this.medicineOrders = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load medicine orders', err);
      }
    });

    this.http.get<any[]>(`http://4.187.152.228:5000/api/MedicalRecords/my-records`).subscribe({
      next: (data) => {
        this.medicalRecords = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.http.get<any[]>(`http://4.187.152.228:5000/api/MedicalRecords/my-prescriptions`).subscribe({
      next: (data) => {
        this.prescriptions = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  uploadRecord(event: any, descriptionInput: any) {
    const desc = descriptionInput.value;
    if (!desc) {
      alert("Please provide a description");
      return;
    }
    // Simulate file upload (in real app, use FormData and post to an upload endpoint that returns FileUrl)
    const payload = {
      description: desc,
      fileUrl: '/assets/sample-record.pdf'
    };

    this.http.post(`http://4.187.152.228:5000/api/MedicalRecords/upload`, payload).subscribe({
      next: (res) => {
        alert("Record uploaded!");
        descriptionInput.value = '';
        this.ngOnInit(); // reload
      },
      error: (err) => console.error(err)
    });
  }
}

