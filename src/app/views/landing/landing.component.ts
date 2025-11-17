import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DialogInfoCardsComponent } from 'src/app/components/dialog-info-cards/dialog-info-cards.component';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

@Component({
  selector: 'app-landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, AfterViewInit {
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

  ngAfterViewInit() {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    ScrollSmoother.create({
      smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
    });

   /*  ScrollTrigger.create({
      trigger: '#benefits-section',
      pin: true,
      anticipatePin: 1,
      scrub: 1,
    })
 */

    gsap.set('#first-benefit-card', { zIndex: 10 });
    gsap.set('#second-benefit-card', { zIndex: 11 });
    gsap.set('#third-benefit-card', { zIndex: 12 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.top-info-cards',
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true,
        pin: true,
      }
    });

    tl.to('#first-benefit-card', {
      duration: 2,
      scale: 0.7,
    });

    tl.to('#second-benefit-card', {
      duration: 2,
      /* yPercent: -100, */
      yPercent: -120,
    }, "-=2");

    tl.to('#first-benefit-card', {
      duration: 1,
      opacity: 0,
    }, "-=1");

    // bring third closer
    tl.to('#third-benefit-card', {
      duration: 0,
      yPercent: -100,
    }, "-=1");


    tl.to('#second-benefit-card', {
      duration: 2,
      scale: 0.7,
    }, "+=2");

    tl.to('#third-benefit-card', {
      duration: 2,
      yPercent: -220,
    }, "-=2");

    tl.to('#second-benefit-card', {
      duration: 1,
      opacity: 0
    }, "-=1");
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
