import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  // If running on server (SSR), allow navigation to proceed
  // Token validation will happen on client-side after hydration
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // On browser side, check if user has a valid token
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    // Store the intended URL to redirect after login
    router.navigate(['/auth/login'], {
      queryParams: {
        returnUrl: state.url,
      },
    });
    return false;
  }

  return true;
};
