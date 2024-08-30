import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoleService } from '../role.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;
  isSuperAdmin: boolean = false;

  constructor(private router: Router, private roleService: RoleService) { }

  ngOnInit() {
    const user = sessionStorage.getItem('user');
    const userRole = this.roleService.getUserRole();
    if (userRole === 'superAdmin') {this.isSuperAdmin = true};
    if (user) {
      const parsedUser = JSON.parse(user);
      this.username = parsedUser.username;
    }
  }

  toggleMenu(){
    const sidePanel = document.getElementById('side-panel');
    if (sidePanel) {
        sidePanel.classList.toggle('open');
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

  goHome(){
    this.router.navigate(['/homepage']);
    this.toggleMenu();
  }

  goExplore(){
    this.router.navigate(['/explore']);
    this.toggleMenu();
  }

  goReports(){
    this.router.navigate(['/reports']);
    this.toggleMenu();
  }

}
