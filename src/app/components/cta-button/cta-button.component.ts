import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import Observer from 'gsap/Observer';
import SplitText from 'gsap/SplitText';

@Component({
  selector: 'app-cta-button',
  // styleUrl: './trusted-by.component.scss',
  templateUrl: './cta-button.component.html',
})
export class CtaButtonComponent implements OnInit, AfterViewInit {
  @Input('pagePosition') pagePosition: 'top' | 'bottom' = 'top'; // default to top

  currentLanguage = 'en';
  abVersion: string;
  pulsatingAnimation: gsap.core.Timeline;

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(newTranslationData => {
      // this observable fires immediately when first run
      this.currentLanguage = newTranslationData?.lang ?? 'pt';
    });

    const abTestVersion = localStorage.getItem('ab-version');
    if (abTestVersion) {
      this.abVersion = abTestVersion;
    } else {
      this.abVersion = gsap.utils.random(0, 1) ? 'B' : 'A'; // random 1 -> version B; random 2 -> version A
      localStorage.setItem('ab-version', this.abVersion); // save to local storage so user doesn't see. different versions on same device
    }
    gsap.registerPlugin(ScrollToPlugin, Observer, SplitText);
  }

  ngAfterViewInit() {
    let currentButton: HTMLButtonElement;
    if (this.pagePosition === 'top') {
      currentButton = document.querySelectorAll('.cta-animated-button')[0] as HTMLButtonElement;
    } else {
      currentButton = document.querySelectorAll('.cta-animated-button')[1] as HTMLButtonElement;
    }
    // animate CTA button
    Observer.create({
      target: currentButton,
      type: 'pointer',
      onHover: () => {
        this.pulsatingAnimation.pause();

        gsap.to(currentButton, {
          scale: 1.2,
        });

        const currentText = currentButton.querySelector('.cta-animated-text');

        const split = new SplitText(currentText, { type: 'words,chars' });

        split.chars.sort((a, b) => gsap.utils.random(0, 1) > 0 ? 1 : -1);
        const fromAbove = split.chars.slice(0, split.chars.length / 2);
        const fromBelow = split.chars.splice(split.chars.length / 2);

        const tl = gsap.timeline();
        tl.from(fromAbove, {
          duration: 0.5,        // animate from 100px below
          yPercent: -100,
          opacity: 0,
          rotation: "random(-100, 100)",
          ease: "back",
          stagger: 0.05
        });

        tl.from(fromBelow, {
          duration: 0.5,        // animate from 100px below
          yPercent: 100,
          opacity: 0,
          rotation: "random(-100, 100)",
          ease: "back",
          stagger: 0.05
        }, '-=0.5'); // start 0.5 before previous aniimation so they are on same time

      },
      onHoverEnd: () => {
        gsap.to(currentButton, {
          scale: 1,
          onComplete: () => this.pulsatingAnimation.restart(true), // restart pulsating animation only after hover end finishes
        });
      },
    });

    this.pulsatingAnimation = gsap.timeline({
      defaults: {
        duration: 1,
        repeat: -1,
        yoyo: true,
      }
    })
    this.pulsatingAnimation.fromTo(currentButton, {
      scale: 1
    }, {
      scale: 1.1
    })
  }

  scrollToContact() {
    let contactSection = document.getElementById('contact-us-wrapper');
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: contactSection, autoKill: true },
    });
  }
}
