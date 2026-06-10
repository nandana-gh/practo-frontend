import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DoctorProfileDto {
  id: number;
  name: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  registrationNumber: string;
  languagesSpoken: string;
  about: string;
  recommendationPercentage: number;
  profileImageUrl: string;
  clinics: ClinicDto[];
}

export interface ClinicDto {
  id: number;
  name: string;
  address: string;
  city: string;
  locality: string;
  timings: string;
  consultationFee: number;
  imageUrl: string;
  latitude: number;
  longitude: number;
}

export interface AppointmentSlotDto {
  date: string;
  availableTimes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private http = inject(HttpClient);
  private apiUrl = 'http://4.187.152.228:5000/api/Doctor';

  getDoctorProfile(id: number): Observable<DoctorProfileDto> {
    return this.http.get<DoctorProfileDto>(`${this.apiUrl}/${id}`);
  }

  getDoctorAvailability(id: number, clinicId?: number, startDate?: string, days: number = 3): Observable<AppointmentSlotDto[]> {
    let params = new HttpParams().set('days', days);
    if (clinicId) params = params.set('clinicId', clinicId);
    if (startDate) params = params.set('startDate', startDate);

    return this.http.get<AppointmentSlotDto[]>(`${this.apiUrl}/${id}/availability`, { params });
  }
}

