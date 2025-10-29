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
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

@Component({
  selector: 'app-landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {
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
  fakeScrolling = false;
  savedScroll = 0;

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
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
    this.smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
    });

    const coverPage = document.querySelector('#cover-page');
    const sibling = coverPage.nextElementSibling;

    // helper to arm the lock
    const armCover = () => {
      console.log('arm cover');
      if (this.fakeScrolling) return;
      this.fakeScrolling = true;
      this.savedScroll = this.smoother.scrollTop();   // exact position while pinned
      this.smoother.paused(true);                // freeze smoothing momentum
      ScrollTrigger.normalizeScroll(true);  // kill browser/touch inertia
      this.scrollObserver.enable();
    };

    // helper to disarm the lock cleanly
    const disarmCover = () => {
      console.log('disarm cover');
      this.scrollObserver.disable();
      // turn things back on *after* we’re exactly where we want
      gsap.delayedCall(0, () => {
        ScrollTrigger.normalizeScroll(false);
        this.smoother.paused(false);
        this.fakeScrolling = false;
      });
    };

    const scrollToTarget = (target: number | Element) => {
      // clamp any incoming deltas and do a controlled snap
      console.log('scrolling to sibling', target);
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: target, autoKill: false }, // don’t let new wheel cancel
        overwrite: 'auto',
        onComplete: disarmCover,
      });
    };
    this.scrollObserver = ScrollTrigger.observe({
      type: "wheel,touch",
      preventDefault: true, // ensure passive: false handlers
      lockAxis: true,
      wheelSpeed: -1,       // keep your mobile-like inversion
      tolerance: 8,
      onDown: (self) => {
        // user tried to scroll UP while on cover -> snap to top of cover
        self.event?.preventDefault();
        scrollToTarget(0);
      },
      onUp: (self) => {
        // user tried to scroll DOWN while on cover -> snap to next section
        self.event?.preventDefault();
        if (sibling) scrollToTarget(sibling);
      },
      // absolutely clamp any stray movement while armed
      onChangeY: (self) => {
        if (!this.fakeScrolling) return;
        self.event?.preventDefault();
        // Put the scroll back exactly where it was during the lock
        this.smoother.scrollTop(this.savedScroll);
      },
      onStop: () => {
        // if something stopped without a snap, make sure we stay clamped
        if (this.fakeScrolling) this.smoother.scrollTop(this.savedScroll);
      },
      onEnable: () => {
        // snapshot the exact scroll so we can clamp to it
        this.savedScroll = this.smoother.scrollTop();
      },
    });
    this.scrollObserver.disable();


    ScrollTrigger.create({
      trigger: coverPage,
      pin: true,
      anticipatePin: 1,
      start: "top top",
      // end: "top top", // end pin when bottom of cover hits top of viewport
      scrub: 1,
      /* onEnter: () => armCover(),
      onEnterBack: () => armCover(),
      onLeave: () => disarmCover(),
      onLeaveBack: () => disarmCover(), */
      snap: {
        snapTo: 'labels',

      }
    });
  }

  ngOnDestroy(): void {
    this.scrollObserver.kill();
    this.smoother.kill();
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
}
