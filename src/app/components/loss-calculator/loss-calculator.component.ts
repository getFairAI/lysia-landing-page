import { Component, computed, OnChanges, OnInit, signal } from '@angular/core';
import { MatSliderDragEvent } from '@angular/material/slider';
import { TranslateService } from '@ngx-translate/core';
import gsap from 'gsap';
import Observer from 'gsap/Observer';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import SplitText from 'gsap/SplitText';

declare global {
  interface Window {
    plausible: (eventName: string, { callback, props, revenue, interactive }: { callback?: () => void; props?: any; revenue?: any; interactive: boolean }) => void;
  }
}

type sliderName = 'team-size' | 'hours' | 'avg-hour-cost';

@Component({
  selector: 'app-loss-calculator',
  styleUrl: './loss-calculator.component.scss',
  templateUrl: './loss-calculator.component.html',
})
export class LossCalculatorComponent implements OnInit {
  private readonly weeksInMonth = 4.35;
  private readonly savePercentage = 0.8;

  currentLanguage;

  teamSize = signal(15);
  wastedHours = signal(8);
  hourCost = signal(10);

  wastedHoursPerMonth = computed(() => this.teamSize() * this.wastedHours() * this.weeksInMonth);

  totalCost = computed(() => this.wastedHoursPerMonth() * this.hourCost());

  potentialSaved = computed(() => this.totalCost() * this.savePercentage);

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(newTranslationData => {
      // this observable fires immediately when first run
      this.currentLanguage = newTranslationData?.lang || 'en';
    });
    gsap.registerPlugin(ScrollToPlugin, Observer, SplitText);

    const currentBtn = document.querySelector('.calculator-btn');

    Observer.create({
      target: currentBtn,
      type: 'pointer',
      onHover: () => {
        gsap.to(currentBtn, {
          scale: 1.02,
        });
        const currentText = currentBtn.querySelector('.cta-animated-text');

        const split = new SplitText(currentText, { type: 'lines, words' });

        gsap.from(split.words, {
          duration: 0.5, // animate from 100px below
          yPercent: -100,
          opacity: 0,
          // rotation: 'random(-100, 100)',
          ease: 'back',
          stagger: 0.05,
        });
      },
      onHoverEnd: () => {
        gsap.to(currentBtn, {
          scale: 1,
        });
      },
    });
  }

  handleEvent(): void {}

  handleDragStop(event: MatSliderDragEvent, sliderName: sliderName): void {
    if (sliderName === 'team-size') {
      window.plausible('Team Size Change', { callback: this.handleEvent, interactive: false, props: { value: event.value } });
    } else if (sliderName === 'avg-hour-cost') {
      window.plausible('Avg Hourly Cost Change', { callback: this.handleEvent, interactive: false, props: { value: event.value } });
    } else if (sliderName === 'hours') {
      window.plausible('Hours Per Week Change', { callback: this.handleEvent, interactive: false, props: { value: event.value } });
    } else {
      // do nothing
    }
  }

  contactUsScrollToDiv() {
    let elementPosition = document.getElementById('contact-us-wrapper');
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: elementPosition, autoKill: true },
    });
  }
}
