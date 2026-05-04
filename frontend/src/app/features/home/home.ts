import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  products: any[] = [];
  loading = false;

  ngOnInit() {
    this.load();
  }

  goToDetail(id: string) {
    this.router.navigate(['/product', id]);
  }

  load() {
    this.loading = true;
    this.cdr.markForCheck(); 

    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = res?.data?.listProduct || [];
        this.loading = false;

        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Load products error:', err);
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  formatPrice(price: number) {
    return price.toLocaleString('vi-VN') + ' ₫';
  }
}