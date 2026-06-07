import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SurgeryTreatmentDto {
  id: number;
  name: string;
  imageUrl: string;
  isPopular: boolean;
}

export interface SurgeryCategoryDto {
  id: number;
  name: string;
  treatments: SurgeryTreatmentDto[];
}

export interface SurgeryLeadCreateDto {
  name: string;
  mobileNumber: string;
  city: string;
  surgeryName: string;
}

@Injectable({
  providedIn: 'root'
})
export class SurgeryService {
  private apiUrl = 'http://localhost:5016/api/Surgery';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<SurgeryCategoryDto[]> {
    return this.http.get<SurgeryCategoryDto[]>(`${this.apiUrl}/categories`);
  }

  submitLead(lead: SurgeryLeadCreateDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/lead`, lead);
  }
}
