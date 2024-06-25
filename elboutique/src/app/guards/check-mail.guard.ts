import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const checkMailGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const needActivation = sessionStorage.getItem('needactivation');
  const needReset = sessionStorage.getItem('needReset');
  if (needActivation || needReset) {
    return true;
  }
  router.navigateByUrl('/');
  return false;
};
