import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-navbar',
  styleUrl: './auth-navbar.component.scss',
  templateUrl: './auth-navbar.component.html',
})
export class AuthNavbarComponent implements OnInit {
  menuOpen = false;

  menuClosingAnimation = false; // setting to true will trigger the close animation - set it to false after that.

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}

  openMenu() {
    this.menuOpen = true;
  }

  contactUsScrollToDiv() {
    let elementPosition = document.getElementById('contact-us-wrapper');
    elementPosition.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  closeMenu(openLinkUrl?: string, scrollToContactDiv?: boolean) {
    // set openLinkUrl to open a link in a new tab after the menu closes

    this.menuClosingAnimation = true; // wait for animation to finish then close it
    setTimeout(() => {
      this.menuOpen = false;
      this.menuClosingAnimation = false;

      if (openLinkUrl) {
        window.open(openLinkUrl, '_blank');
      }

      if (scrollToContactDiv) {
        this.contactUsScrollToDiv();
      }
    }, 400);
  }
}
