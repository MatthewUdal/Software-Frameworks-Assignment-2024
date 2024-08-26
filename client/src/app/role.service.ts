import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor() { }

  getUserRole(): string | null {
    const userData = sessionStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.role || null;

      } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

}
