import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetUserService {

  constructor() { }

  getUserID(): string | null {
    const userData = sessionStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData._id || null;

      } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }

  getUsername(): string | null {
    const userData = sessionStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        return parsedData.username || null;

      } catch (error) {
        console.error('Error parsing user data from sessionStorage:', error);
        return null;
      }
    }
    return null;
  }
}
