import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-wow-demo',
  styleUrl: './wow-demo.component.scss',
  templateUrl: './wow-demo.component.html',
})
export class WowDemoComponent implements OnDestroy, AfterViewInit {
  @ViewChild('currentContainer') container!: ElementRef; // view child to the current container

  intentObserver: Observer;
  preventScroll: Observer;
  animating = false;
  currentIndex = -1;
  panels: NodeListOf<HTMLDivElement>;
  savedScroll: number;

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);

    this.panels = (this.container.nativeElement as HTMLDivElement).querySelectorAll('.swipe-panel');  // select all divs inside container

    // move all panels to right;
    gsap.set(this.panels, { xPercent: 100 });

    // create an observer and disable it to start
    this.intentObserver = ScrollTrigger.observe({
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

    this.preventScroll = ScrollTrigger.observe({
			preventDefault: true,
			type: "wheel,scroll",
			allowClicks: true,
			onEnable: self => this.savedScroll = self.scrollY(), // save the scroll position
			onChangeY: self => self.scrollY(this.savedScroll)    // refuse to scroll
		});
    this.preventScroll.disable();


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
      onEnter: () => {
        if (!this.preventScroll.isEnabled) {
          (this.container.nativeElement as HTMLDivElement).scrollIntoView(false);
          this.preventScroll.enable();
          this.intentObserver.enable();
          this.move(this.currentIndex +1, true);
        }
      },
      onEnterBack: () => {
        if (!this.preventScroll.isEnabled) {
          (this.container.nativeElement as HTMLDivElement).scrollIntoView(false);
          this.preventScroll.enable();
          this.intentObserver.enable();
          this.move(this.currentIndex -1, false);
          // move last panel to right
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.intentObserver.kill();
    this.preventScroll.kill();
  }

  // handle the panel swipe animations
  move(index: number, forward: boolean) { // true if forward; false is back (down/up)
    console.log('move', forward);
    console.log('index', index);
    this.animating = true;
    // return to normal scroll if we're at the end or back up to the start
    if (
      (index === this.panels.length && forward) ||
      (index <= 0 && !forward)
    ) {
      console.log('should cancel horizontal and scroll normally');
      this.intentObserver.disable();
      this.preventScroll.disable();
      this.animating = false;
      // now make it go 1px beyond in the correct direction so that it doesn't trigger onEnter/onEnterBack.
      this.preventScroll.scrollY(this.preventScroll.scrollY() + (index === this.panels.length ? 1 : -1));
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

    if (index === 0) {
      // first entry
      gsap.to(next, {
        xPercent: forward ? 0 : 100,
        duration: 0.75, ease: "power1.inOut",
        onComplete: () => {
          this.animating = false;
        }
      });
    } else if (index === this.panels.length - 1) {
      // first entry
      gsap.to(next, {
        xPercent: forward ? 0 : -100,
        duration: 0.75, ease: "power1.inOut",
        onComplete: () => {
          this.animating = false;
        }
      });
    } else if (forward) {
      // foes from right to left
      //
      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: "power1.inOut" },
        onComplete: () => this.animating = false
      });

      tl.to(current, {
        xPercent: -100 * index,
      });
      tl.to(next, {
        xPercent: -100 * index,
      });
    } else {
      // pull next to left;
      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: "power1.inOut" },
        onComplete: () => this.animating = false
      });

      tl.to(current, {
        xPercent: 100 * index,
      });
      tl.to(next, {
        xPercent: 100 * index,
      });
    }



    this.currentIndex = index;
  }
}
