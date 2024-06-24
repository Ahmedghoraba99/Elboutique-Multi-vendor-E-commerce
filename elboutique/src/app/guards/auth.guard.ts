import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user_info = localStorage.getItem('user_info');
  if (user_info) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
