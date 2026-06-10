import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DoctorSearchDto {
  id: number;
  name: string;
  specialty: string;
  experienceYears: number;
  clinicName: string;
  locality: string;
  city: string;
  consultationFee: number;
  isVideoConsultationAvailable: boolean;
  recommendationPercentage: number;
  totalReviews: number;
  profileImageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private apiUrl = '/api/Search';

  searchDoctors(params: any): Observable<DoctorSearchDto[]> {
    let httpParams = new HttpParams();
    if (params.city) httpParams = httpParams.set('city', params.city);
    if (params.specialtySlug) httpParams = httpParams.set('specialtySlug', params.specialtySlug);
    if (params.query) httpParams = httpParams.set('query', params.query);
    if (params.gender) httpParams = httpParams.set('gender', params.gender);
    if (params.maxFee) httpParams = httpParams.set('maxFee', params.maxFee);
    if (params.consultType) httpParams = httpParams.set('consultType', params.consultType);
    if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);

    return this.http.get<DoctorSearchDto[]>(`${this.apiUrl}/doctors`, { params: httpParams });
  }
}


