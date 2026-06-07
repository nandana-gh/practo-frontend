import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

// Declare Razorpay on window
declare var window: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  isProcessing: boolean = false;

  constructor(
    public cartService: CartService, 
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  updateQuantity(item: CartItem, delta: number): void {
    this.cartService.updateQuantity(item.id, item.type, delta);
  }

  removeItem(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.type);
  }

  checkout(): void {
    if (!this.authService.isAuthenticated()) {
      alert("Please login to proceed to checkout!");
      this.router.navigate(['/find-doctors']); // Could navigate to login page in future
      return;
    }

    if (this.cartItems.length === 0) return;
    this.isProcessing = true;

    // We split into Medicine and LabTests and send to respective backend endpoints if they exist
    // Or we send to a Unified checkout. Since we agreed on a universal cart, let's create a unified checkout 
    // endpoint in the backend. 
    // First, let's post to `api/Medicines/checkout-universal` (we will build this endpoint)
    
    this.http.post<any>('http://localhost:5016/api/Payment/checkout-cart', {
      items: this.cartItems.map(i => ({
        id: i.id,
        type: i.type,
        quantity: i.quantity,
        price: i.price
      })),
      shippingAddress: "Home Address" // Hardcoded for demo
    }).subscribe({
      next: (res) => {
        this.openRazorpay(res);
      },
      error: (err) => {
        console.error('Checkout failed', err);
        alert('Failed to initiate checkout.');
        this.isProcessing = false;
      }
    });
  }

  private openRazorpay(orderData: any) {
    const options = {
      key: orderData.razorpayKeyId,
      amount: orderData.fee * 100, // in paise
      currency: 'INR',
      name: 'Practo Clone',
      description: 'Cart Checkout',
      order_id: orderData.razorpayOrderId,
      handler: (response: any) => {
        this.verifyPayment(response, orderData.orderGroupToken);
      },
      prefill: {
        name: this.authService.currentUser()?.firstName,
        email: this.authService.currentUser()?.email,
        contact: '9999999999'
      },
      theme: {
        color: '#2b3b8c'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed');
          this.isProcessing = false;
        }
      }
    };

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', (response: any) => {
      console.error(response.error);
      alert('Payment failed: ' + response.error.description);
      this.isProcessing = false;
    });

    rzp.open();
  }

  private verifyPayment(paymentResponse: any, orderGroupToken: string) {
    this.http.post<any>('http://localhost:5016/api/Payment/verify-cart', {
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,
      orderGroupToken: orderGroupToken
    }).subscribe({
      next: () => {
        alert('Payment successful! Your orders have been placed.');
        this.cartService.clearCart();
        this.router.navigate(['/patient/dashboard']);
        this.isProcessing = false;
      },
      error: (err) => {
        console.error('Payment verification failed', err);
        alert('Payment verification failed. Please contact support.');
        this.isProcessing = false;
      }
    });
  }
}
