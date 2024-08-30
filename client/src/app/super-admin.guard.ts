import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from './role.service';

export const superAdminGuard = () => {
  const roleService = inject(RoleService);
  const router = inject(Router);
  const userRole = roleService.getUserRole();

  if (userRole === 'superAdmin') {
    return true;
  } else {
    router.navigate(['/homepage']);
    return false;
  }
};
