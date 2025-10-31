import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DialogInfoCardsComponent } from 'src/app/components/dialog-info-cards/dialog-info-cards.component';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import gsap from 'gsap';
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Observer } from 'gsap/Observer';
import { WowDemoComponent } from './wow-demo/wow-demo.component';

@Component({
  selector: 'app-landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wowDemo') wowDemoComponent!: WowDemoComponent;

  videoCardsUrls = {
    card1: '',
    card2: '',
    card3: '',
    card4: '',
    card5: '',
  };

  contactSectionInputsTexts = {
    fullNamePlaceholder: '',
    emailPlaceholder: '',
    messagePlaceholder: '',
  };

  notifSnackbarMessage: {
    success: 'Message sent succesfully. We will be in touch very soon!';
    error: 'An error occurred. Please, try again.';
  }; // message to show after form submit

  formGroupContactUs = new FormGroup({
    // field names must be equal to those configured in emailjs service
    userFullname: new FormControl('', Validators.required),
    userEmail: new FormControl('', [Validators.required, Validators.email]),
    userMessage: new FormControl('', [Validators.required, Validators.maxLength(4000)]),
  });

  submittingForm = false; // triggers submitting animation

  scrollObserver: Observer;
  smoother: ScrollSmoother;
  scrollTrigger: ScrollTrigger;

  savedScroll = 0;
  currentIndex = -1;
  // wrap = gsap.utils.wrap(0, sections.length),
  animating;
  sections: NodeListOf<HTMLElement>;
  images: NodeListOf<HTMLElement>;
  innerWrappers: unknown[];
  outerWrappers: unknown[];


  constructor(private translateService: TranslateService, private dialog: MatDialog, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // this event fires at the first page open so it will bring the default language files on page open
    this.translateService.onLangChange.subscribe({
      next: (newLangData: TranslationChangeEvent) => {
        this.videoCardsUrls.card1 = newLangData.translations?.CARDS?.CARD1?.VIDEO_URL ?? '';
        this.videoCardsUrls.card2 = newLangData.translations?.CARDS?.CARD2?.VIDEO_URL ?? '';
        this.videoCardsUrls.card3 = newLangData.translations?.CARDS?.CARD3?.VIDEO_URL ?? '';
        this.videoCardsUrls.card4 = newLangData.translations?.CARDS?.CARD4?.VIDEO_URL ?? '';
        this.videoCardsUrls.card5 = newLangData.translations?.CARDS?.CARD5?.VIDEO_URL ?? '';

        this.contactSectionInputsTexts.fullNamePlaceholder = newLangData.translations?.CONTACT_SECTION?.CONTACT_FORMS_CARDS?.CONTACT_FORM_INPUTS?.FULLNAMEPLACEHOLDER ?? '';
        this.contactSectionInputsTexts.emailPlaceholder = newLangData.translations?.CONTACT_SECTION?.CONTACT_FORMS_CARDS?.CONTACT_FORM_INPUTS?.EMAILPLACEHOLDER ?? '';
        this.contactSectionInputsTexts.messagePlaceholder = newLangData.translations?.CONTACT_SECTION?.CONTACT_FORMS_CARDS?.CONTACT_FORM_INPUTS?.MESSAGEPLACEHOLDER ?? '';

        this.notifSnackbarMessage = {
          success: newLangData.translations?.SNACKBAR?.MESSAGE_SUBMIT_SUCCESS ?? 'Message sent succesfully. We will be in touch very soon!',
          error: newLangData.translations?.SNACKBAR?.MESSAGE_SUBMIT_ERROR ?? 'An error occurred. Please, try again.',
        };
      },
      error: error => {
        console.log(error);
      },
    });
  }

  ngAfterViewInit(): void {
    this.handleAnimations();
  }

  ngOnDestroy(): void {
    this.scrollObserver.kill();
    this.smoother.kill();
    this.scrollTrigger.kill();
  }

  scrollRight() {
    let element = document.getElementById('scrollable-div');
    let cardReference = document.getElementById('card-scroll-reference');
    element.scrollLeft += cardReference.clientWidth + 35; // add a few units to include paddings and margins
  }

  scrollLeft() {
    let element = document.getElementById('scrollable-div');
    let cardReference = document.getElementById('card-scroll-reference');
    element.scrollLeft -= cardReference.clientWidth + 35;
  }

  scrollDownLearnMore() {
    let cardsSection = document.getElementById('top-info-cards-section');
    cardsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }

  openLinkNewTab(linkUrl: string) {
    window.open(linkUrl, '_blank');
  }

  submitContactForm() {
    if (this.formGroupContactUs.valid) {
      this.formGroupContactUs.disable();
      this.submittingForm = true;
      emailjs.send('service_5s8jchq', 'template_231dukm', this.formGroupContactUs.getRawValue(), { publicKey: '4HHqO-lLCP9kvCE2z' }).then(
        (result: EmailJSResponseStatus) => {
          this.submittingForm = false;
          this.formGroupContactUs.reset();
          this.formGroupContactUs.enable();

          this._snackBar.open(this.notifSnackbarMessage.success, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-custom-css', 'success'],
          });
        },
        error => {
          console.log('EMAILJS CONTACT FORM ERROR:', error);
          this.submittingForm = false;
          this.formGroupContactUs.enable();

          this._snackBar.open(this.notifSnackbarMessage.error, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-custom-css', 'error'],
          });
        }
      );
    }
  }

  clickInfoCardOpenDialog(infoCardId: string) {
    this.dialog.open(DialogInfoCardsComponent, {
      data: {
        infoCardId: infoCardId,
      },
    });
  }

  handleAnimations() {
    gsap.registerPlugin(Observer, ScrollTrigger, ScrollSmoother);
    this.smoother = ScrollSmoother.create({
      wrapper: "#main-page",
      content: "#main-content",
      smooth: 1,
      effects: true,
    });

    this.sections = document.querySelectorAll(".section-fake-scroll");
    this.images = document.querySelectorAll(".bg");
    this.outerWrappers = gsap.utils.toArray(".outer");
    this.innerWrappers = gsap.utils.toArray(".inner");

    gsap.set(this.outerWrappers, { yPercent: 100 });
    gsap.set(this.innerWrappers, { yPercent: -100 });

    this.scrollObserver = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -0.1,
      onDown: (self) => !this.animating && this.gotoSection(this.currentIndex - 1, -1),
      onUp: () => !this.animating &&  this.gotoSection(this.currentIndex + 1, 1),
      tolerance: 10,
      preventDefault: true,
      onStop: (self) => {

        if (this.currentIndex === 1) {
          // second section /main content
          this.scrollObserver.disable();
          this.wowDemoComponent.activateSideScroll(self.deltaY < 0);
        }

        if (this.currentIndex === 2) {
          this.scrollTrigger.enable();
          this.scrollObserver.disable();
        } else {
          this.scrollTrigger.disable();
        }
      }
    });

    this.gotoSection(0, 1);

    this.scrollTrigger = ScrollTrigger.create({
      trigger: '#main-page',
      pin: false,
      // anticipatePin: 1,
      start: "top center",
      scrub: 1,
      onUpdate: (event) => {
        if (this.currentIndex === 2 && event.direction === -1 && event.scroll() < 1) {
          this.gotoSection(1, -1);
          this.wowDemoComponent.activateSideScroll(false);
        }
      },
    });

    this.scrollTrigger.disable();
  }

  gotoSection(index, direction) {
      if (index > this.sections.length - 1|| index < 0) {
        console.log('ignored');
        return;
      }
      this.animating = true;
      let fromTop = direction === -1,
          dFactor = fromTop ? -1 : 1,
          tl = gsap.timeline({
            defaults: { duration: 0.5, ease: "power4.inOut" },
            onComplete: () => this.animating = false
          });
      if (this.currentIndex >= 0) {
        // The first time this function runs, current is -1
        gsap.set(this.sections[this.currentIndex], { zIndex: 0 });
        tl.to(this.images[this.currentIndex], { yPercent: -100 * dFactor })
          // .set(this.sections[this.currentIndex], { autoAlpha: 0 });
          .to(this.sections[this.currentIndex], { autoAlpha: 0 });
      }
      // gsap.set(this.sections[index], { autoAlpha: 1, zIndex: 1 });
      tl
        .to(this.sections[index], { autoAlpha: 1, zIndex: 1 })
        .fromTo([this.outerWrappers[index], this.innerWrappers[index]], {
          yPercent: i => i ? -100 * dFactor : 100 * dFactor
        }, {
          yPercent: 0
        }, 0)
        .fromTo(this.images[index], { yPercent: 100 * dFactor }, { yPercent: 0 }, 0);

      this.currentIndex = index;
    }
}
