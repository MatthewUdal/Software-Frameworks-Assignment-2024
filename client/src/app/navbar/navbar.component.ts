import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: string | null = null;

  constructor(private router: Router) { }

  ngOnInit() {
    const user = sessionStorage.getItem('user');
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

}
