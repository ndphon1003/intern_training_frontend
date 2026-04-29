import { Component, inject } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  private api = inject(ApiService);

  load() {
    this.api.getProducts().subscribe(res => {
      console.log('Products:', res);
    });
  }
}