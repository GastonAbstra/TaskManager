import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../services/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const hasRefreshToken = !!authStore.refreshToken();

  if (!hasRefreshToken) {
    router.navigateByUrl('/auth/signin');
    return false;
  }

  return true;
};