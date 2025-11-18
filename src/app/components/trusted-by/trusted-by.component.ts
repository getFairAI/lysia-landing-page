import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-trusted-by',
  styleUrl: './trusted-by.component.scss',
  templateUrl: './trusted-by.component.html',
})
export class TrustedByComponent implements AfterViewInit {
  @ViewChild('trackA') trackA!: ElementRef<HTMLDivElement>;
  @ViewChild('trackB') trackB!: ElementRef<HTMLDivElement>;
  @ViewChild('trackC') trackC!: ElementRef<HTMLDivElement>;

  logos = [
    { url: 'https://arweave.org/', src: './assets/img/logos/arweave-logo.png' },
    { url: 'https://arbitrum.io/', src: './assets/img/logos/arbitrum-logo.png' },
    { url: 'https://www.rndao.io/', src: './assets/img/logos/rndao.png' },
    { url: 'https://forward.arweave.dev/', src: './assets/img/logos/forward-research-logo.png' },
    { url: 'https://www.techstars.com/', src: './assets/img/logos/techstars-logo.png' },
  ];

  constructor() {}

  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    console.log(event);
  }

  ngAfterViewInit(): void {
    console.log(window.innerWidth);
    const trackAEl = this.trackA.nativeElement;
    const trackBEl = this.trackB.nativeElement;
    const trackCEl = this.trackC.nativeElement;

    const width = trackAEl.scrollWidth; // width of one full set
    /* console.log(trackAEl.offsetWidth);
    const speed = 20; // px per second → adjust as you like
    const duration = width / speed;
    console.log(width); */

    // Place A starting at 0, B immediately to its right
    gsap.set(trackAEl, { x: 0 });
    gsap.set(trackBEl, { x: 0 });
    gsap.set(trackCEl, { x: 0 });
    // Vertically center via GSAP, not CSS transform


    const tracks = [trackAEl, trackBEl, trackCEl];

    gsap.to(tracks, {
      xPercent: -100,
      duration: 10,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x: string, target: HTMLElement) => {
          let n = parseFloat(x);

          // If this track went fully off to the left,
          // jump it to the right side of the other track.
          if (n <= -width) {
            const other = target === trackAEl ? trackAEl : target === trackBEl ? trackBEl : trackCEl;
            const otherX = gsap.getProperty(other, 'x') as number;
            n = otherX + width;
          }

          return `${n}px`;
        },
      },
    });
  }
}
