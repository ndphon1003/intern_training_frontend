import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

const TOKEN_KEY = 'token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  const url = req.url;

  // Bypass đúng API này
  if (url.includes('/api/product/list')) {
    return next(req);
  }

  // Bypass auth API
  if (url.includes('/auth/')) {
    return next(req);
  }

  let token: string | null = null;

  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem(TOKEN_KEY);
  }

  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};