import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const storageData = localStorage.getItem('user_info');

  const router = new Router();

  if (!storageData) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
