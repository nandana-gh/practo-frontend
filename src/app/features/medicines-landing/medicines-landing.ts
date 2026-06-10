import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MedicineService, MedicinesLandingDto } from '../../core/services/medicine';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

declare var Razorpay: any;

@Component({
  selector: 'app-medicines-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicines-landing.html',
  styleUrls: ['./medicines-landing.css']
})
export class MedicinesLandingComponent implements OnInit {
  landingData: MedicinesLandingDto | null = null;
  loading = true;
  error = '';
  purchaseSuccess = false;

  constructor(
    private medicineService: MedicineService, 
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.medicineService.getLandingData().subscribe({
      next: (data) => {
        this.landingData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching medicines:', err);
        this.error = 'Failed to load medicines data. Please check your backend connection.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Helper arrays for splitting product stars/ratings (optional visual detail)
  getArray(num: number) {
    return new Array(num);
  }

  addToCart(product: any) {
    this.cartService.addToCart({
      id: product.id,
      type: 'Medicine',
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    });
    alert(`${product.name} added to cart!`);
  }
}

