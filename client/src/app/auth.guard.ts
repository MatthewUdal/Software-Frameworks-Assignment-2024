import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;

  if (user) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
