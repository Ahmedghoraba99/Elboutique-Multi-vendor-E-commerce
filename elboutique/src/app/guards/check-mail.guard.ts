import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const checkMailGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const needActivation = localStorage.getItem('needactivation');
  if (needActivation === 'true') {
    return true;
  }
  router.navigateByUrl('/');
  return false;
};
