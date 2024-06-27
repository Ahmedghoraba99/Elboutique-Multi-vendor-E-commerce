import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const storageData = localStorage.getItem('user_info');

  if (!storageData) {
    console.log('User not authenticated');
    const router = new Router();
    router.navigateByUrl('login');
    return false;
  }

  const token = JSON.parse(storageData).token;
  const role = JSON.parse(storageData).role;

  if (!token || role !== 'admin') {
    console.log('Not authorized');
    const router = new Router();
    router.navigateByUrl('not-authorized');
    return false;
  }

  return true;
};
