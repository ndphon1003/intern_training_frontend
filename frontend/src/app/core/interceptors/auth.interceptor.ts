import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

const TOKEN_KEY = 'token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Bypass /auth/**
  if (req.url.includes('/auth/')) {
    return next(req);
  }

  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem(TOKEN_KEY);
  }

  if (!token) {
    return next(req);
  }

  const newReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

console.log('platform:', typeof window);
console.log('token:', token);
console.log('url:', req.url);

  return next(newReq);
};