import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-practo-prime',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './practo-prime.html',
  styleUrls: ['./practo-prime.css']
})
export class PractoPrimeComponent implements OnInit {
  leadForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  
  subscriptionPlans: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.leadForm = this.fb.group({
      name: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      city: ['', Validators.required],
      speciality: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchSubscriptionPlans();
  }

  fetchSubscriptionPlans() {
    this.http.get<any[]>('/api/Subscription/plans').subscribe({
      next: (data) => {
        this.subscriptionPlans = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load subscription plans', err);
      }
    });
  }

  onSubmit(): void {
    if (this.leadForm.invalid) {
      Object.keys(this.leadForm.controls).forEach(key => {
        this.leadForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = '';

    this.http.post('/api/providers/join', this.leadForm.value)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.submitSuccess = true;
          this.leadForm.reset();
        },
        error: (err) => {
          console.error('Error submitting lead form', err);
          this.submitError = 'Failed to submit. Please try again later.';
        }
      });
  }

  scrollTo(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  buySubscription(plan: any) {
    if (!this.authService.isAuthenticated()) {
      alert('You must be logged in to purchase a subscription.');
      return;
    }

    this.http.post(`/api/Subscription/purchase/${plan.id}`, {}).subscribe({
      next: (res: any) => {
        if (res.razorpayOrderId) {
          const options = {
            key: res.razorpayKeyId,
            amount: res.fee * 100,
            currency: 'INR',
            name: 'Practo Clone',
            description: `Practo Prime - ${plan.name}`,
            order_id: res.razorpayOrderId,
            handler: (response: any) => {
              this.verifyPayment(res.razorpayOrderId, response.razorpay_payment_id, response.razorpay_signature, res.subscriptionId);
            },
            theme: { color: '#4b2e83' }
          };
          const rzp = new Razorpay(options);
          rzp.on('payment.failed', (response: any) => {
            alert('Payment failed: ' + response.error.description);
          });
          rzp.open();
        }
      },
      error: (err) => {
        alert('Failed to initiate checkout. Please try again.');
      }
    });
  }

  verifyPayment(orderId: string, paymentId: string, signature: string, refId: number) {
    const payload = {
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      type: 'Subscription',
      referenceId: refId
    };

    this.http.post('/api/payment/verify', payload).subscribe({
      next: (res: any) => {
        alert('Payment successful! Your Practo Prime subscription is now active.');
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Payment verification failed.');
      }
    });
  }
}


