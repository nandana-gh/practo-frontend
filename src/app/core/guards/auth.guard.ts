import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const expectedRoles = route.data['roles'] as Array<string>;
    if (expectedRoles && expectedRoles.indexOf(authService.userRole() || '') === -1) {
      router.navigate(['/']);
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};

