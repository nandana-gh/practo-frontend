import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LabTestsService, LabTestsLandingDto } from '../../core/services/lab-tests';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-lab-tests-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lab-tests-landing.html',
  styleUrls: ['./lab-tests-landing.css']
})
export class LabTestsLandingComponent implements OnInit {
  @ViewChild('testsScroll') testsScroll!: ElementRef;
  @ViewChild('packagesScroll') packagesScroll!: ElementRef;

  landingData: LabTestsLandingDto | null = null;
  loading = true;
  error = '';
  searchTerm = '';

  constructor(
    private labTestsService: LabTestsService, 
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.labTestsService.getLandingData().subscribe({
      next: (data) => {
        this.landingData = data;
        this.loading = false;
        this.error = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching lab tests:', err);
        this.error = 'Failed to load lab tests data. Please check your backend connection.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addToCart(test: any) {
    this.cartService.addToCart({
      id: test.id,
      type: 'LabTest',
      name: test.name,
      price: test.price,
      quantity: 1,
      imageUrl: test.imageUrl || test.iconUrl
    });
    alert(`${test.name} added to cart!`);
  }

  get filteredTopTests() {
    if (!this.landingData) return [];
    if (!this.searchTerm) return this.landingData.topBookedTests;
    const term = this.searchTerm.toLowerCase();
    return this.landingData.topBookedTests.filter(t => t.name.toLowerCase().includes(term) || (t.knownAs && t.knownAs.toLowerCase().includes(term)));
  }

  get filteredPackages() {
    if (!this.landingData) return [];
    if (!this.searchTerm) return this.landingData.popularPackages;
    const term = this.searchTerm.toLowerCase();
    return this.landingData.popularPackages.filter(p => p.name.toLowerCase().includes(term));
  }

  scrollRight(element: HTMLElement) {
    element.scrollBy({ left: 300, behavior: 'smooth' });
  }

  onSearch(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.cdr.detectChanges();
  }
}

