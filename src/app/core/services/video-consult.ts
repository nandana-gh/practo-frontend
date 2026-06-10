import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface SpecialtyCardDto {
  id: number;
  name: string;
  slug: string;
  startingPrice: number;
}

export interface DoctorCardDto {
  id: number;
  name: string;
  specialty: string;
  experienceYears: number;
  profileImageUrl: string;
}

export interface VideoConsultStatsDto {
  happyPatients: string;
  verifiedDoctors: string;
  specialtiesCount: string;
  appRating: string;
}

export interface VideoConsultLandingDto {
  specialties: SpecialtyCardDto[];
  doctors: DoctorCardDto[];
  stats: VideoConsultStatsDto;
}

@Injectable({
  providedIn: 'root'
})
export class VideoConsultService {
  private apiUrl = 'http://4.187.152.228:5000/api/VideoConsult';

  constructor(private http: HttpClient) { }

  getLandingPageData(): Observable<VideoConsultLandingDto> {
    return this.http.get<VideoConsultLandingDto>(`${this.apiUrl}/landing`);
  }
}

