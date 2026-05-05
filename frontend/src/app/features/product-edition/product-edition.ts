import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-edition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edition.html',
  styleUrl: './product-edition.css',
})
export class ProductEdition implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  productId!: string;

  product: Product | null = null;

  isLoading = false;
  errorMessage = '';

  isEditMode = false;
  isSaving = false;

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    public: [false],
  });

  async ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';

    if (!this.productId) {
      this.errorMessage = 'Missing product id';
      this.cdr.detectChanges();
      return;
    }

    await this.loadDetail();
  }

  async loadDetail() {
    this.isLoading = true;
    this.cdr.detectChanges();

    try {
      const res = await firstValueFrom(
        this.productService.getProductDetail(this.productId)
      );

      this.product = res.data;

      // fill form
      this.form.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        public: this.product.public,
      });

    } catch (err: any) {
      this.errorMessage = err?.error?.message || 'Load failed';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  enableEdit() {
    this.isEditMode = true;

    if (this.product) {
      this.form.reset({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        public: this.product.public,
      });
    }

    this.cdr.detectChanges();
  }

  cancelEdit() {
    this.isEditMode = false;

    if (this.product) {
      this.form.reset({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        public: this.product.public,
      });
    }

    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.cdr.detectChanges();
  }

  async submitUpdate() {
    if (!this.product) return;

    this.isSaving = true;
    this.cdr.detectChanges();

    try {
      const res = await firstValueFrom(
        this.productService.updateProduct({
          productId: this.productId,
          name: this.form.value.name!,
          description: this.form.value.description!,
          price: this.form.value.price!,
          public: this.form.value.public!,
          deleted: false,
        })
      );

      // update local state
      this.product = res.data;
      this.isEditMode = false;

      // sync form lại theo server response
      this.form.reset({
        name: res.data.name,
        description: res.data.description,
        price: res.data.price,
        public: res.data.public,
      });

      this.form.markAsPristine();

      this.cdr.detectChanges();

    } catch (err) {
      console.error(err);
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  goBack() {
    this.router.navigate(['/product-management']);
  }
}