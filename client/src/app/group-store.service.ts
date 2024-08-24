import { Injectable } from '@angular/core';
import { Group } from './interfaces/group.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupStoreService {
  private groups: Group[] = [];

  constructor() {
    this.loadGroups();
  }

  // Load groups from localStorage
  loadGroups(): Group[] {
    const storedGroups = sessionStorage.getItem('groups');
    if (storedGroups) {
      return JSON.parse(storedGroups) as Group[];
    }
    return []; // Return an empty array if no groups are stored
  }

  // Save groups to localStorage
  saveGroups(): void {
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }

  // Initialize groups (e.g., from the component)
  initializeGroups(initialGroups: Group[]): void {
    this.groups = initialGroups;
    this.saveGroups();
  }

  // Add a new group
  addGroup(group: Group): void {
    this.groups.push(group);
    this.saveGroups();
  }

  // Find a group by ID
  findGroupById(groupID: number): Group | undefined {
    return this.groups.find(g => g.groupID === groupID);
  }

  // Delete a group by ID
  deleteGroup(groupID: number): void {
    this.groups = this.groups.filter(g => g.groupID !== groupID);
    this.saveGroups();
  }

  // Get all groups
  getAllGroups(): Group[] {
    return this.groups;
  }

  getViewableGroups(): Group[] {
    const userData = sessionStorage.getItem('user');
    if (!userData) {
      return []; // Return an empty array if no user data is found
    }

    const currentUser = JSON.parse(userData);
    const CUID = currentUser.userID;

    // Filter groups where the current user ID is in the memberIDs array
    return this.groups.filter(group => group.memberIDs.includes(CUID));
  }
  
}
