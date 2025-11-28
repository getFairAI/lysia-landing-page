import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import gsap from 'gsap';
import Flip from 'gsap/Flip';

@Component({
  selector: 'app-how-to',
  templateUrl: './how-to.component.html',
  styleUrl: './how-to.component.scss',
})
export class HowToComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('iconEl', { read: ElementRef }) iconEls!: QueryList<ElementRef>;
  @ViewChild('iconsContainer', { static: true })
  iconsContainer!: ElementRef<HTMLElement>;
  // order matters here
  icons = [
    { type: 'db', translationKey: 'HOW_TO.STEP1' },
    { type: 'import', translationKey: 'HOW_TO.STEP2' },
    { type: 'ai', translationKey: 'HOW_TO.STEP5' },
    { type: 'parse', translationKey: 'HOW_TO.STEP3' },
    { type: 'dash', translationKey: 'HOW_TO.STEP4' },
  ];

  currentHighlightIdx = 0;
  loopTl: gsap.core.Timeline;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    gsap.registerPlugin(Flip);
  }

  ngAfterViewInit(): void {
    this.animateLabels();
    this.loopTl = gsap.timeline({
      repeat: -1, // loop forever
      repeatDelay: 2.5, // time between rotations (optional)
    });

    this.loopTl.call(() => this.rotateLoopAnimation());
  }

  ngOnDestroy(): void {
    this.loopTl?.kill();
  }

  rotateLoopAnimation() {
    const elements = this.iconEls.map(el => el.nativeElement);

    // 1. capture current positions & sizes
    // 🔹 1. measure starting height
    const container = this.iconsContainer.nativeElement;
    const label = container.querySelector('[data-flip-id="feature-label"]') as HTMLElement | null;
    const startHeight = container.offsetHeight;
    const state = Flip.getState([...elements, label]);

    // 2. rotate array: first becomes last
    // iterms are display as: 1/ 2 - 5 / 3 -4
    // for first to be the last it needs to go to "third position"
    // need to always change position 0 into 3; and position 2 into 4
    this.icons = [this.icons[1], this.icons[3], this.icons[0], this.icons[4], this.icons[2]];

    this.cdr.detectChanges();

    const newLabel = container.querySelector('[data-flip-id="feature-label"]') as HTMLElement | null;

    // keep container from collapsing
    gsap.set(container, { height: startHeight });
    gsap.set(newLabel, { opacity: 0 });

    // 3) set up timeline
    const tl = gsap.timeline();

    // 4. animate from previous layout to new layout
    const iconRotation = Flip.from(state, {
      targets: elements,
      duration: 0.7,
      ease: 'power2.inOut',
      stagger: 0.03,
      absolute: true, // <— important with flex-wrap + row swapping
      nested: true, // helps if you have transforms inside
      scale: true, // optional, but looks nicer if sizes change

      onComplete: () => {
        // let height go back to auto after animation
        gsap.set(container, { clearProps: 'height' });
      },
    });

    tl.add(iconRotation, 0);

    tl.to(
      newLabel,
      {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      },
      0.5 // start time inside the Flip (tweak: closer to 0.7 for later)
    );
  }

  rotate(backwards = false) {
    if (this.loopTl.isActive()) {
      this.loopTl.pause();
    }
    const elements = this.iconEls.map(el => el.nativeElement);

    // 1. capture current positions & sizes
    // 🔹 1. measure starting height
    const container = this.iconsContainer.nativeElement;
    const label = container.querySelector('[data-flip-id="feature-label"]') as HTMLElement | null;
    const startHeight = container.offsetHeight;
    const state = Flip.getState([...elements, label]);

    // 2. rotate array: first becomes last
    // iterms are display as: 1/ 2 - 5 / 3 -4
    // for first to be the last it needs to go to "third position"
    // need to always change position 0 into 3; and position 2 into 4
    if (backwards) {
      this.icons = [this.icons[2], this.icons[0], this.icons[4], this.icons[1], this.icons[3]];
    } else {
      this.icons = [this.icons[1], this.icons[3], this.icons[0], this.icons[4], this.icons[2]];
    }

    this.cdr.detectChanges();

    const newLabel = container.querySelector('[data-flip-id="feature-label"]') as HTMLElement | null;

    // keep container from collapsing
    gsap.set(container, { height: startHeight });
    gsap.set(newLabel, { opacity: 0 });

    // 3) set up timeline
    const tl = gsap.timeline();

    // 4. animate from previous layout to new layout
    const iconRotation = Flip.from(state, {
      targets: elements,
      duration: 0.7,
      ease: 'power2.inOut',
      stagger: 0.03,
      absolute: true, // <— important with flex-wrap + row swapping
      nested: true, // helps if you have transforms inside
      scale: true, // optional, but looks nicer if sizes change

      onComplete: () => {
        // let height go back to auto after animation
        gsap.set(container, { clearProps: 'height' });
        if (!this.loopTl.isActive()) {
          this.loopTl.restart(true);
        }
      },
    });

    tl.add(iconRotation, 0);

    tl.to(
      newLabel,
      {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      },
      // start time inside the Flip (tweak: closer to 0.7 for later)
    );
  }

  private animateLabels() {
    const labels = this.iconEls.map(el => el.nativeElement.querySelector('.icon-label'));
    labels.forEach((label, index) => {
      if (!label) return;

      // Top one fades IN
      if (index === 0) {
        gsap.to(label, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      // Others fade OUT
      else {
        gsap.to(label, {
          opacity: 0,
          y: -5, // subtle shift up
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  }
}
