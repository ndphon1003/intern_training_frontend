import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
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

  products: any[] = [];
  loading = false;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.cdr.markForCheck(); // báo Angular cần check UI

    this.api.getProducts().subscribe({
      next: (res: any) => {
        this.products = res?.data?.listProduct || [];
        this.loading = false;

        this.cdr.detectChanges(); // ép render ngay
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