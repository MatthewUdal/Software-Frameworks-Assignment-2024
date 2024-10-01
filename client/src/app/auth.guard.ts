import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const user = typeof window !== 'undefined' ? sessionStorage.getItem('user') : null;

  if (user) {
    const userID = JSON.parse(user)._id;
    console.log(userID)
    
    return http.post<{ success: boolean, message: string }>('https://s5394035.elf.ict.griffith.edu.au:3000/authCheck/verifyUser', { userID }).pipe(
      map(response => {
        if (response.success) {
          return true;
        } else {
          router.navigate(['/login']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Error verifying user:', error);
        router.navigate(['/login']);
        return of(false);
      })
    );
  } else {
    router.navigate(['/login']);
    return of(false);
  }
};