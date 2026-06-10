import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  type: 'Medicine' | 'LabTest';
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>(this.getInitialCart());
  public cartItems$ = this.cartItems.asObservable();

  constructor() {}

  private getInitialCart(): CartItem[] {
    const saved = localStorage.getItem('practo_cart');
    return saved ? JSON.parse(saved) : [];
  }

  private saveCart(items: CartItem[]) {
    localStorage.setItem('practo_cart', JSON.stringify(items));
    this.cartItems.next(items);
  }

  addToCart(item: CartItem) {
    const items = this.cartItems.getValue();
    const existing = items.find(i => i.id === item.id && i.type === item.type);
    
    if (existing) {
      existing.quantity += item.quantity;
      this.saveCart([...items]);
    } else {
      this.saveCart([...items, item]);
    }
  }

  updateQuantity(id: number, type: 'Medicine' | 'LabTest', delta: number) {
    const items = this.cartItems.getValue();
    const item = items.find(i => i.id === id && i.type === type);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(id, type);
      } else {
        this.saveCart([...items]);
      }
    }
  }

  removeFromCart(id: number, type: 'Medicine' | 'LabTest') {
    const items = this.cartItems.getValue().filter(i => !(i.id === id && i.type === type));
    this.saveCart(items);
  }

  clearCart() {
    this.saveCart([]);
  }

  getTotal(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems.getValue().reduce((acc, item) => acc + item.quantity, 0);
  }
}

