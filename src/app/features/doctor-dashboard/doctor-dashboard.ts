import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-dashboard.html'
})
export class DoctorDashboardComponent implements OnInit {
  appointments: any[] = [];
  isLoading = true;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.http.get<any[]>(`http://localhost:5016/api/Appointment/doctor`).subscribe({
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
  }
}
