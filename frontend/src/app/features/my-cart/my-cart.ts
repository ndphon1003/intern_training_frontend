import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Cart } from '../models/cart.model';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-my-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-cart.html',
  styleUrl: './my-cart.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyCart implements OnInit {

  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  carts: Cart[] = [];
  cartView: any[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.loadCart();
  }

loadCart() {
  this.isLoading = true;
  this.errorMessage = '';
  this.cdr.markForCheck();

  this.cartService.getCarts().subscribe({
    next: (res) => {
      this.carts = res.data || [];

      this.cdr.markForCheck(); // 🔥 ADD THIS

      this.enrichCart();
    },
    error: () => {
      this.errorMessage = 'Failed to load cart';
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  });
}

enrichCart() {

  if (!this.carts.length) {
    this.cartView = [];
    this.isLoading = false;
    this.cdr.markForCheck();
    return;
  }

  const requests = this.carts.map(item =>
    this.productService.getProductDetail(item.productId)
  );

  forkJoin(requests.length ? requests : []).subscribe({
    next: (products) => {

      this.cartView = this.carts.map((cart, index) => ({
        id: cart.id,
        productName: products[index]?.data?.name,
        quantity: cart.quantity,
        addAt: cart.addAt
      }));

      this.isLoading = false;
      this.cdr.markForCheck();
    },
    error: () => {
      this.errorMessage = 'Failed to load product info';
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  });
}

  get totalItems(): number {
    return this.carts.reduce((sum, item) => sum + item.quantity, 0);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  removeCart(cartId: string) {
    this.cartService.removeFromCart(cartId).subscribe({
      next: () => {
        console.log(this.carts[1]);
        // remove local state first (optimistic UI)
        this.carts = this.carts.filter(c => c.id !== cartId);

        // rebuild view
        this.enrichCart();

        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Remove failed';
        this.cdr.markForCheck();
      }
    });
  }
}