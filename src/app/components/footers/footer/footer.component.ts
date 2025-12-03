import { Component } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-footer',
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  date = new Date().getFullYear();
  constructor() {}

  openLinkNewTab(linkUrl: string) {
    window.open(linkUrl, '_blank');
  }

  scrollDownLearnMore() {
    let contactSection = document.getElementById('contact-us-wrapper');
    /* contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    }); */
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: contactSection, autoKill: true },
    });
  }
}
