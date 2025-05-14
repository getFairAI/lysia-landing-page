import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-navbar',
  styleUrl: './auth-navbar.component.scss',
  templateUrl: './auth-navbar.component.html',
})
export class AuthNavbarComponent implements OnInit {
  navbarOpen = false;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  contactUsScrollToDiv() {
    let elementPosition = document.getElementById('contact-us-wrapper');
    elementPosition.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
