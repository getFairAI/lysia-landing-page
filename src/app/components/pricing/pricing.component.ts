import { Component } from '@angular/core';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {

  constructor() {
    gsap.registerPlugin(ScrollToPlugin);
  }

  scrollToContact() {
    let contactSection = document.getElementById('contact-us-wrapper');
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: contactSection, autoKill: true },
    });
  }
}
