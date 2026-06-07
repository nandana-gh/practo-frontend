import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DiagnosticTest {
  id: number;
  name: string;
  knownAs: string;
  price: number;
  originalPrice: number;
}

export interface HealthCheckupPackage {
  id: number;
  name: string;
  imageUrl: string;
  discountPercent: number;
  includedTestsCount: number;
  idealFor: string;
  price: number;
  originalPrice: number;
}

export interface HealthConcern {
  id: number;
  name: string;
  iconUrl: string;
}

export interface VitalCheckup {
  id: number;
  name: string;
  iconUrl: string;
  description: string;
}

export interface LabTestsLandingDto {
  topBookedTests: DiagnosticTest[];
  popularPackages: HealthCheckupPackage[];
  healthConcerns: HealthConcern[];
  recommendedVitalCheckups: VitalCheckup[];
}

@Injectable({
  providedIn: 'root'
})
export class LabTestsService {
  private apiUrl = 'http://localhost:5016/api/labtests';

  constructor(private http: HttpClient) { }

  getLandingData(): Observable<LabTestsLandingDto> {
    return this.http.get<LabTestsLandingDto>(`${this.apiUrl}/landing`);
  }
}
