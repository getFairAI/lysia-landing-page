import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

@Component({
  selector: 'app-landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit, AfterViewInit {
  abVersion: string;
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
  constructor(private translateService: TranslateService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

    const abTestVersion = localStorage.getItem('ab-version');
    if (abTestVersion) {
      this.abVersion = abTestVersion;
    } else {
      this.abVersion = gsap.utils.random(0, 1) ? 'B' : 'A'; // random 1 -> version B; random 2 -> version A
      localStorage.setItem('ab-version', this.abVersion); // save to local storage so user doesn't see. different versions on same device
    }
    // this event fires at the first page open so it will bring the default language files on page open
    this.translateService.onLangChange.subscribe({
      next: (newLangData: TranslationChangeEvent) => {
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
    ScrollSmoother.create({
      smooth: 1, // how long (in seconds) it takes to "catch up" to the native scroll position
      effects: true, // looks for data-speed and data-lag attributes on elements
      smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
    });

    gsap.set('#first-benefit-card', { zIndex: 10 });
    gsap.set('#second-benefit-card', { zIndex: 11 });
    gsap.set('#third-benefit-card', { zIndex: 12 });

    /* const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.top-info-cards',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: true,
        pinSpacing: false,
        // pinnedContainer: '.top-info-cards'
      },
    });


    tl.to(['#second-benefit-card', '#third-benefit-card', '#first-benefit-card'], {

      yPercent: (i) => i < 2 ? -130 : 0,
      scale: (i) => i === 2 ? 0.85 : 1,
      opacity: (i) => i === 2 ? 0 : 1,
    }, "+=2"); // start 1s earlier

    tl.to(['#second-benefit-card', '#third-benefit-card'], {
      yPercent: (i) => i < 1 ? -130 : -240,
      scale: (i) => i === 0 ? 0.85 : 1,
      opacity: (i) => i === 0 ? 0 : 1,
    }, "+=2"); // start 1s earlier

    tl.to('#benefits-extra', { opacity: 1 }); */
  }

  scrollDownLearnMore() {
    let contactSection = document.getElementById('contact-us-wrapper');
    /* contactSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    }); */
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: contactSection, autoKill: true },
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
}
