import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicineCategoryDto {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  backgroundColor: string;
}

export interface MedicineProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
}

export interface MedicinesLandingDto {
  healthConditions: MedicineCategoryDto[];
  categories: MedicineCategoryDto[];
  popularProducts: MedicineProductDto[];
}

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  private apiUrl = 'http://4.187.152.228:5000/api/Medicines';

  constructor(private http: HttpClient) { }

  getLandingData(): Observable<MedicinesLandingDto> {
    return this.http.get<MedicinesLandingDto>(`${this.apiUrl}/landing`);
  }
}

