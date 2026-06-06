import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { AuthService } from '../../core/services/auth.service';

interface SpecialtyItem {
  name: string;
  type: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Search state variables
  locationInput = 'Kochi';
  queryInput = '';
  
  showLocationDropdown = false;
  showSearchDropdown = false;

  // Mock data for cities and specialties
  citiesList: string[] = [
    'Kochi',
    'Kolhapur',
    'Rochester Ny',
    'Rochester Mn',
    'Rochester Mi',
    'Rochester Nh',
    'Rochester In',
    'Rochester Il',
    'Rochester Ma',
    'Rochester Pa',
    'Rochester Wa',
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Chennai'
  ];

  specialtiesList: SpecialtyItem[] = [
    { name: 'Dentist', type: 'SPECIALITY' },
    { name: 'Gynecologist/obstetrician', type: 'SPECIALITY' },
    { name: 'General Physician', type: 'SPECIALITY' },
    { name: 'Dermatologist', type: 'SPECIALITY' },
    { name: 'Ear-nose-throat (ent) Specialist', type: 'SPECIALITY' },
    { name: 'Homoeopath', type: 'SPECIALITY' },
    { name: 'Ayurveda', type: 'SPECIALITY' }
  ];

  // Filter lists based on input prefix
  get filteredCities(): string[] {
    if (!this.locationInput) return this.citiesList;
    const filterValue = this.locationInput.toLowerCase();
    return this.citiesList.filter(city => city.toLowerCase().includes(filterValue));
  }

  get filteredSpecialties(): SpecialtyItem[] {
    if (!this.queryInput) return this.specialtiesList;
    const filterValue = this.queryInput.toLowerCase();
    return this.specialtiesList.filter(spec => spec.name.toLowerCase().includes(filterValue));
  }

  // Location Methods
  onLocationFocus(): void {
    this.showLocationDropdown = true;
  }

  onLocationBlur(): void {
    // delay slightly to allow mousedown events on suggestions list to fire first
    setTimeout(() => {
      this.showLocationDropdown = false;
    }, 150);
  }

  selectCity(city: string): void {
    this.locationInput = city;
    this.showLocationDropdown = false;
  }

  clearLocation(): void {
    this.locationInput = '';
    this.showLocationDropdown = true;
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      this.locationInput = 'Detecting location...';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.locationInput = 'Kochi'; // Mock fallback for simplicity
          this.showLocationDropdown = false;
        },
        (error) => {
          this.locationInput = 'Kochi';
          this.showLocationDropdown = false;
        }
      );
    } else {
      this.locationInput = 'Kochi';
      this.showLocationDropdown = false;
    }
  }

  // Search Query Methods
  onSearchFocus(): void {
    this.showSearchDropdown = true;
  }

  onSearchBlur(): void {
    setTimeout(() => {
      this.showSearchDropdown = false;
    }, 150);
  }

  selectSpecialty(spec: string): void {
    this.queryInput = spec;
    this.showSearchDropdown = false;
    this.executeSearch();
  }

  executeSearch(): void {
    // Navigate to Search results page passing the query params
    this.router.navigate(['/search'], {
      queryParams: {
        city: this.locationInput || 'Kochi',
        q: this.queryInput
      }
    });
  }
}
