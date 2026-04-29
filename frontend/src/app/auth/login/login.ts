import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private router = inject(Router);

login() {
  localStorage.setItem('token', 'fake-jwt-token');
  console.log('Token set:', localStorage.getItem('token')); // Kiểm tra xem token đã được lưu chưa
  this.router.navigate(['/profile']); // Sau khi set token thì điều hướng sang trang Profile
}
}