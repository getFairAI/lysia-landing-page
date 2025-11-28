import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import CSSRulePlugin from 'gsap/CSSRulePlugin';

@Component({
  selector: 'app-benefit-cards',
  templateUrl: './benefit-cards.component.html',
  styleUrl: './benefit-cards.component.scss',
})
export class BenefitCardsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('benefitsTrack') benefitsTrack!: ElementRef<HTMLDivElement>;

  private cards: HTMLElement[] = []; // original card references
  private activeIndex = 0; // logical active index (0..2)
  private readonly totalCards = 3;
  loopTl: gsap.core.Timeline;
  fillTween: gsap.core.Tween;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(Flip, CSSRulePlugin);
    const track = this.benefitsTrack.nativeElement;

    // grab the original cards once
    this.cards = Array.from(track.querySelectorAll<HTMLElement>('.benefit-card'));

    // On start, we want:
    //   active = 0 (first)
    //   left  = last
    //   right = second
    // DOM order: [last, active, next]
    this.activeIndex = 0;
    this.applyDomOrder(false); // no animation on first layout

    this.loopTl = gsap.timeline({
      repeat: -1, // loop forever
      repeatDelay: 4.05, // time between rotations (optional)
    });

    this.loopTl.call(() => {
      this.goToCard(this.activeIndex + 1, true);
    });
  }

  ngOnDestroy(): void {
    this.loopTl?.kill();
  }

  // Called by buttons
  goToCard(index: number, fromLoop = false): void {
    const safeIdx = ((index % this.totalCards) + this.totalCards) % this.totalCards;
    const forward = safeIdx > this.activeIndex;

    if (!fromLoop) {
      this.loopTl.pause();
      this.fillTween.revert();
      this.fillTween.kill();
    }
    if (safeIdx === this.activeIndex) {
      // do nothing;
    } else {
      this.activeIndex = safeIdx;
      this.applyDomOrder(true, forward);
      // after running new animation restart loop from current index
    }
  }

  private applyDomOrder(animate: boolean, forward = true): void {
    const track = this.benefitsTrack.nativeElement;

    if (!this.cards.length) return;
    const n = this.totalCards;

    const direction = 1;
    const prevIndex = (this.activeIndex - direction + n) % n;
    const nextIndex = (this.activeIndex + direction) % n;
    const prevCard = this.cards[prevIndex];
    const activeCard = this.cards[this.activeIndex];
    const nextCard = this.cards[nextIndex];

    // Desired DOM order to have active in the middle:
    // [previous, active, next]
    const newOrder = [this.cards[prevIndex], this.cards[this.activeIndex], this.cards[nextIndex]];
    const buttons = Array.from(document.querySelectorAll<HTMLElement>('.track-button'));
    const fill = buttons[this.activeIndex].querySelector('.track-button-fill');

    this.cdr.detectChanges();

    const tl = gsap.timeline();
    tl.to(buttons, {
      scale: (i) => i === this.activeIndex ? 1.3 : 1,
    });


    if (animate) {
      this.fillTween = gsap.to(fill, {
        duration: 4,
        scaleX: 1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(fill, { scaleX: 0 });
          // after clicking buttons manually loop is disabled
          // after running the fill animation check if loop is off and re-enable it
          if (!this.loopTl.isActive()) {
            this.loopTl.restart();
          }
        },
      });
      const state = Flip.getState(track.children);
      // Rebuild DOM in the new order
      newOrder.forEach(card => track.appendChild(card));

      // flex visual order
      // Flex visual order: [prev, active, next]
      gsap.set(prevCard,  { order: 0, zIndex: forward ? 1 : 0, scale: 0.9 });
      gsap.set(activeCard,{ order: 1, zIndex: 2, scale: 1 }); // center + top
      gsap.set(nextCard,  { order: 2, zIndex: forward ? 0 : 1, scale: 0.9 });

      // Animate from previous state to new state
      Flip.from(state, {
        duration: 0.6,
        ease: 'power2.inOut',
        yoyo: true,
        // absolute: true,
        // absolute: true, // animate in their own layer, avoids weird overlap pushes
      });
    } else {
      // First layout: just reorder without animation
      newOrder.forEach(card => track.appendChild(card));
      gsap.set(prevCard,  { scale: 0.9 });
      gsap.set(nextCard,  { scale: 0.9 });
    }
  }
}
