import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
@Component({
  selector: 'app-wow-demo',
  styleUrl: './wow-demo.component.scss',
  templateUrl: './wow-demo.component.html',
})
export class WowDemoComponent implements OnDestroy, AfterViewInit {
  @ViewChild('currentContainer') container!: ElementRef<HTMLDivElement>; // view child to the current container
  @Input('parentObserver') parentObserver: Observer;
  scrollObserver: Observer;

  preventScroll: Observer;
  animating = false;
  currentIndex = -1;
  sections: NodeListOf<HTMLElement>;
  // wrap = gsap.utils.wrap(0, sections.length),
  images: NodeListOf<HTMLElement>;
  innerWrappers: unknown[];
  outerWrappers: unknown[];
  splitHeadings;
  savedScrollDelta: number;


  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger, Observer, DrawSVGPlugin);

    this.sections = document.querySelectorAll("section .demo");
    this.images = document.querySelectorAll(".demo-bg");
    this.outerWrappers = gsap.utils.toArray(".demo-outer");
    this.innerWrappers = gsap.utils.toArray(".demo-inner");
    const headings = gsap.utils.toArray(".heading-section");
    this.splitHeadings = headings.map(heading => new SplitText(heading as HTMLElement, { type: "chars,words,lines", linesClass: "clip-text" })),
    console.log(this.splitHeadings);
    // move all panels to right;
    gsap.set(this.outerWrappers, { xPercent: 100 });
    gsap.set(this.innerWrappers, { xPercent: -100 });
    gsap.set("#scroll-progress", { drawSVG: '0%' });

    this.scrollObserver = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onDown: () =>{ !this.animating && this.gotoSection(this.currentIndex - 1, -1)},
      onUp: () => !this.animating && this.gotoSection(this.currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true,
    });

   /*  this.gotoSection(0, 1); */
    this.scrollObserver.disable();
  }

  ngOnDestroy(): void {
    this.preventScroll.kill();
  }

  gotoSection(index, direction) {
    console.log('scrolled wow')
    console.log(index);
    console.log(direction);
    console.log(this.currentIndex);
    if (index > this.sections.length - 1 || index < 0) {
      const lastScrollUp = index < 0 && direction === -1;
      const lastScrollDown = index > this.sections.length - 1 && direction === 1;

      if (lastScrollUp){
        // if we are at the limit, enable parent scroll so it can go to previous or next section
        this.scrollObserver.disable();
        this.parentObserver.enable();
        this.parentObserver.scrollY(this.parentObserver.scrollY() -1);

      }
      if (lastScrollDown) {
        // if we are at the limit, enable parent scroll so it can go to previous or next section
        this.scrollObserver.disable();
        this.parentObserver.enable();
      }

      this.currentIndex = index;
      return;
    }
    this.animating = true;
    let fromTop = direction === -1,
        dFactor = fromTop ? -1 : 1,
        tl = gsap.timeline({
          defaults: { duration: 1, ease: "power4.inOut" },
          onComplete: () => this.animating = false
        });

    const step = 100 / this.sections.length;



    if (this.currentIndex >= 0) {
      // The first time this function runs, current is -1
      gsap.set(this.sections[this.currentIndex], { zIndex: 0 });
      tl

        .to(this.images[this.currentIndex], { xPercent: -100 * dFactor })
        // .to("#scroll-progress", { drawSVG: !fromTop ? `0% ${step + step * index}%` : `0% ${step + step * index}%`, duration: 1, ease:'power1.inOut' })
        .set(this.sections[this.currentIndex], { autoAlpha: 0 });
    }

    gsap.to("#scroll-progress", { drawSVG: !fromTop ? `0% ${step + step * index}%` : `0% ${step + step * index}%`, duration: 1, ease:'power1.inOut' })

    gsap.set(this.sections[index], { autoAlpha: 1, zIndex: 1});
    tl
      .fromTo([this.outerWrappers[index], this.innerWrappers[index]], {
        xPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, {
        xPercent: 0
      }, 0)

      .fromTo(this.images[index], { xPercent: 100 * dFactor }, { xPercent: 0 }, 0)

      .fromTo(this.splitHeadings[index].chars, {
        autoAlpha: 0,
        xPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        xPercent: 0,
        duration: 1,
        ease: "power1.inOut",
        stagger: {
          each: 0.005,
          from: "random"
        }
      }, 0.2);
    this.currentIndex = index;
  }

  getFirstPageTimeline(fromTop: boolean) {
    const index = 0;
    const dFactor = fromTop ? -1 : 1;
    const step = 100 / this.sections.length;

    const tl = gsap.timeline();
    tl.set(this.sections[index], { autoAlpha: 1, zIndex: 1})
      .fromTo([this.outerWrappers[index], this.innerWrappers[index]], {
        xPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, {
        xPercent: 0
      }, 0)
      .fromTo(this.images[index], { xPercent: 100 * dFactor }, { xPercent: 0 }, 0)
      .to("#scroll-progress", { drawSVG: !fromTop ? `0% ${step + step * index}%` : `0% ${step + step * index}%`, duration: 1, ease:'power1.inOut' })
      .fromTo(this.splitHeadings[index].chars, {
        autoAlpha: 0,
        xPercent: 150 * dFactor
      }, {
        autoAlpha: 1,
        xPercent: 0,
        duration: 1,
        ease: "power1.inOut",
        stagger: {
          each: 0.005,
          from: "random"
        }
      }, 0.2);

    return tl;
  }

  activateSideScroll(goingDown: boolean) {
    this.scrollObserver.enable();
    if (goingDown) {
      this.gotoSection(0, 1);
    } else {
      this.gotoSection(this.sections.length - 1, -1);
    }
    /* this.scrollObserver.scrollX(0);
    this.scrollObserver.scrollY(0); */
  }
}
