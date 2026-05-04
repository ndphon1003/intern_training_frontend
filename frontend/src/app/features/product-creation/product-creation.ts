import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-creation.html',
  styleUrl: './product-creation.css',
})
export class ProductCreation {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(1000)]],
    stockQuantity: [0, [Validators.required, Validators.min(1)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.productService.createProduct(this.form.value as any).subscribe({
      next: () => {
        this.isLoading = false;

        // navigate ngay sau khi success
        this.router.navigateByUrl('/product-management');
      },

      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Create failed';
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/product-management');
  }

  get f() {
    return this.form.controls;
  }
}