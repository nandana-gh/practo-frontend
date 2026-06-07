import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Customer {
  name: string;
  logoUrl: string;
}

@Component({
  selector: 'app-software-hospitals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './software-hospitals.html',
  styleUrls: ['./software-hospitals.css']
})
export class SoftwareHospitalsComponent implements OnInit {
  
  customers: Customer[] = [
    { name: 'NMC', logoUrl: 'nmc' },
    { name: 'VPS Healthcare', logoUrl: 'vps' },
    { name: 'Wockhardt Hospitals', logoUrl: 'wockhardt' },
    { name: 'Tree Top', logoUrl: 'treetop' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.http.get<Customer[]>('http://localhost:5016/api/hospitals/customers').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.customers = data;
        }
      },
      error: (err) => console.error('Failed to fetch customers', err)
    });
  }
}
