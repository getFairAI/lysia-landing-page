import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';
import Observer from 'gsap/Observer';

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
      this.currentLanguage = newTranslationData?.lang ?? 'en';
    });
    gsap.registerPlugin(Observer);
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
      scale: 1.3,
      opacity: 1,
      xPercent: 10,
      zIndex: 10,
      // borderRadius: '1.5rem',
    });
  }

  animateHoverEnd(event: globalThis.Observer, idx: number) {
    gsap.to(event.target, {
      scale: 1,
      xPercent: 0,
      zIndex: 1,
      // borderRadius: 0,
      /* ...(idx === 0 && { borderRadius: '1.5rem 0 0 0' }),
      ...(idx === 1 && { borderRadius: '0 1.5rem 0 0' }),
      ...(idx === 2 && { borderRadius: '0 0 0 1.5rem' }),
      ...(idx === 3 && { borderRadius: 0 }),
      ...(idx === 4 && { borderRadius: '0 0 1.5rem 0' }), */
    });
  }
}
