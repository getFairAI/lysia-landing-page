import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-navbar',
  styleUrl: './auth-navbar.component.scss',
  templateUrl: './auth-navbar.component.html',
})
export class AuthNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  contactUsScrollToDiv() {
    let elementPosition = document.getElementById('contact-us-wrapper');
    elementPosition.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
