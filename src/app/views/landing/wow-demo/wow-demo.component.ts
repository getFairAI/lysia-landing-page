import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
@Component({
  selector: 'app-wow-demo',
  styleUrl: './wow-demo.component.scss',
  templateUrl: './wow-demo.component.html',
})
export class WowDemoComponent implements OnDestroy, AfterViewInit {
  @ViewChild('currentContainer') container!: ElementRef<HTMLDivElement>; // view child to the current container
  @Input('scrollObserver') scrollObserver: Observer;

  preventScroll: Observer;
  animating = false;
  currentIndex = -1;
  panels: NodeListOf<HTMLDivElement>;
  savedScroll: number;

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

    this.panels = (this.container.nativeElement as HTMLDivElement).querySelectorAll('.swipe-panel');  // select all divs inside container

    // move all panels to right;
    gsap.set(this.panels, { xPercent: 100, autoAlpha: 0 });
    gsap.set("#scroll-progress", { drawSVG: '0%' });

    // create an observer and disable it to start
    /* this.scrollObserver = ScrollTrigger.observe({
        type: "wheel,touch",
        onUp: () => !this.animating && this.move(this.currentIndex +1, true), // down is up
        onDown: () => !this.animating && this.move(this.currentIndex -1, false), // up is true
        wheelSpeed: -1, // to match mobile behavior, invert the wheel speed
        tolerance: 10,
        preventDefault: true,
        onPress: self => {
          // on touch devices like iOS, if we want to prevent scrolling, we must call preventDefault() on the touchstart (Observer doesn't do that because that would also prevent side-scrolling which is undesirable in most cases)
          ScrollTrigger.isTouch && self.event.preventDefault()
        }
      })
      this.intentObserver.disable();
  */
    /* this.preventScroll = ScrollTrigger.observe({
			preventDefault: true,
			type: "wheel,scroll",
			allowClicks: true,
			onEnable: self => this.savedScroll = self.scrollY(), // save the scroll position
			onChangeY: self => self.scrollY(this.savedScroll)    // refuse to scroll
		});
    this.preventScroll.disable(); */


    /* gsap.to(horizontalSections, {
      xPercent: -100 * (horizontalSections.length - 1),
      ease: "none",
      scrollTrigger: {
        start: 'center center',
        trigger: this.container.nativeElement,
        pin: true,
        scrub: 1,
        // base vertical scrolling on how wide the container is so it feels more natural.
        // end: "+=3500",
        // end: `+=${(this.container.nativeElement as HTMLDivElement).clientWidth}`,
        end: 0,
      }
    }); */

    // pin swipe section and initiate observer
    ScrollTrigger.create({
      trigger: this.container.nativeElement,
      pin: true,
      anticipatePin: 1,
      start: "center center",
      scrub: 1,
      onEnter: () => {
        console.log('enter')
        if (!this.preventScroll.isEnabled) {
          gsap.to("#scroll-progress", { drawSVG: '0%' });
          (this.container.nativeElement as HTMLDivElement).scrollIntoView({ behavior: 'instant', block: 'end', inline: 'nearest' });
          this.preventScroll.enable();
          this.scrollObserver.enable();
          this.move(this.currentIndex +1, true);
        }
      },
      onEnterBack: () => {
        console.log('enter back')
        if (!this.preventScroll.isEnabled) {
          gsap.to("#scroll-progress", { drawSVG: "100%" });
          (this.container.nativeElement as HTMLDivElement).scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
          this.preventScroll.enable();
          this.scrollObserver.enable();
          this.move(this.currentIndex -1, false);
          // move last panel to right
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.preventScroll.kill();
  }

  // handle the panel swipe animations
  move(index: number, forward: boolean) { // true if forward; false is back (down/up)

    const ease = "slow(0.9,2,true)";
    // scroll progress

    const progressStart = index === 0 ? 1 : 0;
    const progressEnd = 25 * index;
    gsap.to("#scroll-progress", { drawSVG: forward ? `${progressStart}% ${progressEnd}%` : `${progressEnd}% ${progressStart}%`, duration: 1, ease });
    console.log('move', forward);
    console.log('index', index);
    this.animating = true;
    // return to normal scroll if we're at the end or back up to the start
    if (
      (index === this.panels.length && forward) ||
      (index <= 0 && !forward)
    ) {
      console.log('should cancel horizontal and scroll normally');
      this.scrollObserver.disable();
      this.preventScroll.disable();
      this.animating = false;
      // now make it go 1px beyond in the correct direction so that it doesn't trigger onEnter/onEnterBack.
      // make it snap to up or bottom sections
      if (!forward) {
        this.preventScroll.scrollY(0); // scroll to top automatically
      } else {
        const nextSection = document.querySelector('#afterDemo');
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
      }

      return;
    }


    //   target the second panel, last panel?
    let current = this.panels[this.currentIndex];
    let next = forward ? this.panels[index] : current;
    console.log(next);

   /*  gsap.fromTo([current, next], {
      xPercent: (i) => forward && index === 0,
      duration: 1.5,
      onComplete: () => {
        this.animating = false;
      }
    }, { xPercent: i => i === index ? 0 : i < index ? -100 - 100 * i : 100 + 100* i}); */


    if (index === 0 && forward) {
      // first entry going down
      gsap.to(next, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 1,
        ease,
        onComplete: () => {
          console.log('first time going down');
          this.animating = false;
        }
      });
    } else if (forward) {
      // foes from right to left
      /* gsap.set(current, { autoAlpha: 0, xPercent: forward ? -100 : 100 });
      gsap.to(next, {
        xPercent: -100 * index,
        autoAlpha: 1,
      }); */
      const tl = gsap.timeline({
        ease,
        duration: 0.5,
        onComplete: () => {
          console.log('tl finished right to left');
          this.animating = false;
        }
      });
      tl.to(current, { xPercent: forward ? -100 : 100, autoAlpha: 0, })
        .to(next, { autoAlpha: 1, xPercent: -100 * index });

    } else {

      /* gsap.set(current, { autoAlpha: 0, xPercent: 100 });
      gsap.to(next, {
        xPercent: 0 + 100* index,
        autoAlpha: 1,
        ease,
        duration: 1,
        onComplete: () => {
          console.log('tl finished right to left');
          this.animating = false;
        }
      }); */

      const tl = gsap.timeline({
        ease,
        duration: 0.5,
        onComplete: () => {
          console.log('tl finished right to left');
          this.animating = false;
        }
      });
      tl.to(current, { xPercent: 100 * index, autoAlpha: 0,  })
        .to(next, { autoAlpha: 1, xPercent: 0 + 100 * index  });
    }

    this.currentIndex = index;
  }
}
