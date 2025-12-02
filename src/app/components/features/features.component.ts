import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';
import Observer from 'gsap/Observer';
import SplitText from 'gsap/SplitText';

@Component({
  selector: 'app-features',
  // styleUrl: './trusted-by.component.scss',
  templateUrl: './features.component.html',
})
export class FeaturesComponent implements OnInit, AfterViewInit {
  currentLanguage = 'en';

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(newTranslationData => {
      // this observable fires immediately when first run
      this.currentLanguage = newTranslationData?.lang ?? 'pt';
    });
    gsap.registerPlugin(Observer, SplitText);
  }

  ngAfterViewInit() {
    // animate card hovers
    /* Observer.create({
      target: '',
      type: 'pointer',
      onHover: this.animateHover,
      onHoverEnd: this.animateHoverEnd,
    }); */
    const cards = document.querySelectorAll('.feature-cards');
    cards.forEach((cardEl, idx) => {
      Observer.create({
        target: cardEl,
        type: 'pointer',
        onHover: this.animateHover,
        onHoverEnd:  (event) => this.animateHoverEnd(event, idx),
      });
    });
  }

  animateHover(event: globalThis.Observer) {
    // const currentBr = event.target.
    gsap.to(event.target, {
      scale: 1.2,
    });
    // animateText

    const cardNumber = event.target.querySelector('.card-number');
    const numberSplit = SplitText.create(cardNumber, { type: 'chars' });
    gsap.from(numberSplit.chars, {
      duration: 0.5,
      rotate: (i) => i === 0 ? 360 : 0, // rotate only first char
      xPercent: -100,
      autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
      stagger: 0,  // 0.05 seconds between each
    });

    const cardText = event.target.querySelector('p'); // p inside current hovered div
    const textSplit = SplitText.create(cardText, { type: 'chars' });
    gsap.from(textSplit.chars, {
      duration: 0.5,
      xPercent: -100,
      autoAlpha: 0,   // fade in from opacity: 0 and visibility: hidden
      stagger: 0.05,  // 0.05 seconds between each
    });
  }

  animateHoverEnd(event: globalThis.Observer, idx: number) {
    gsap.to(event.target, {
      scale: 1,
    });
  }
}
