import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  pendingDoctors: any[] = [];
  medicineOrders: any[] = [];
  labTestOrders: any[] = [];
  surgeryLeads: any[] = [];
  patients: any[] = [];
  allDoctors: any[] = [];
  appointments: any[] = [];
  medicinesInventory: any[] = [];
  labTestsInventory: any[] = [];

  newMedicine = { name: '', description: '', price: null, originalPrice: null, imageUrl: '', isPopular: false };
  newLabTest = { name: '', knownAs: '', price: null, originalPrice: null };

  isLoading = false;
  successMessage = '';
  errorMessage = '';
  activeTab: 'doctors' | 'medicines' | 'labtests' | 'surgeries' | 'patients' | 'alldoctors' | 'appointments' | 'manage_medicines' | 'manage_labtests' = 'doctors';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchPendingDoctors();
    this.fetchMedicineOrders();
    this.fetchLabTestOrders();
    this.fetchSurgeryLeads();
    this.fetchAllPatients();
    this.fetchAllDoctors();
    this.fetchAppointments();
  }

  fetchAllPatients(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/patients').subscribe({
      next: (data) => {
        this.patients = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  fetchAllDoctors(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/doctors').subscribe({
      next: (data) => {
        this.allDoctors = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  fetchAppointments(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/appointments').subscribe({
      next: (data) => {
        this.appointments = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  fetchLabTestOrders(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/labtest-orders').subscribe({
      next: (data) => {
        this.labTestOrders = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  fetchSurgeryLeads(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/surgery-leads').subscribe({
      next: (data) => {
        this.surgeryLeads = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  fetchMedicineOrders(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:5016/api/admin/medicine-orders').subscribe({
      next: (data) => {
        this.medicineOrders = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load medicine orders', err);
        this.errorMessage = 'Failed to load medicine orders.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchPendingDoctors(): void {
    this.isLoading = true;
    // In a real app, you would pass an Admin token.
    this.http.get('http://localhost:5016/api/admin/pending-doctors').subscribe({
      next: (res: any) => {
        this.pendingDoctors = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load pending approvals.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approveDoctor(id: number): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.http.post(`http://localhost:5016/api/admin/approve-doctor/${id}`, {}).subscribe({
      next: (res: any) => {
        this.successMessage = res.message;
        // Remove approved doctor from the list
        this.pendingDoctors = this.pendingDoctors.filter(d => d.id !== id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to approve doctor.';
        this.cdr.detectChanges();
      }
    });
  }

  intimatePatient(leadId: number): void {
    this.http.post(`http://localhost:5016/api/admin/intimate-surgery-lead/${leadId}`, {}).subscribe({
      next: (res: any) => {
        this.successMessage = res.message || 'Notification sent successfully.';
        this.errorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to send notification.';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }

  fetchMedicinesInventory(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/inventory/medicines').subscribe({
      next: (data) => {
        this.medicinesInventory = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  addMedicine(): void {
    // Prevent sending null to backend for required fields or defaults
    const payload = {
      ...this.newMedicine,
      price: this.newMedicine.price || 0,
      originalPrice: this.newMedicine.originalPrice || this.newMedicine.price || 0
    };
    
    this.http.post('http://localhost:5016/api/admin/inventory/medicines', payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Medicine added successfully!';
        this.errorMessage = '';
        this.fetchMedicinesInventory();
        this.newMedicine = { name: '', description: '', price: null, originalPrice: null, imageUrl: '', isPopular: false };
      },
      error: (err) => {
        this.errorMessage = 'Failed to add medicine. ' + (err.error?.title || err.message);
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }

  deleteMedicine(id: number): void {
    if(confirm('Are you sure you want to delete this medicine?')) {
      this.http.delete(`http://localhost:5016/api/admin/inventory/medicines/${id}`).subscribe({
        next: () => {
          this.successMessage = 'Medicine deleted successfully.';
          this.fetchMedicinesInventory();
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete medicine.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  fetchLabTestsInventory(): void {
    this.http.get<any[]>('http://localhost:5016/api/admin/inventory/labtests').subscribe({
      next: (data) => {
        this.labTestsInventory = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  addLabTest(): void {
    const payload = {
      ...this.newLabTest,
      price: this.newLabTest.price || 0,
      originalPrice: this.newLabTest.originalPrice || this.newLabTest.price || 0
    };

    this.http.post('http://localhost:5016/api/admin/inventory/labtests', payload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Lab test added successfully!';
        this.errorMessage = '';
        this.fetchLabTestsInventory();
        this.newLabTest = { name: '', knownAs: '', price: null, originalPrice: null };
      },
      error: (err) => {
        this.errorMessage = 'Failed to add lab test. ' + (err.error?.title || err.message);
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }

  deleteLabTest(id: number): void {
    if(confirm('Are you sure you want to delete this lab test?')) {
      this.http.delete(`http://localhost:5016/api/admin/inventory/labtests/${id}`).subscribe({
        next: () => {
          this.successMessage = 'Lab test deleted successfully.';
          this.fetchLabTestsInventory();
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete lab test.';
          this.cdr.detectChanges();
        }
      });
    }
  }
}
