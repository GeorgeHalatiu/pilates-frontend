import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const userRole = localStorage.getItem('role');

  if (userRole) {
    return true; 
  } else {
    router.navigate(['/login']);
    return false;
  }
};