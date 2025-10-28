import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { DialogInfoCardsComponent } from 'src/app/components/dialog-info-cards/dialog-info-cards.component';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import gsap from 'gsap';
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
    console.log('here');
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
    console.log('here2');

  }

  ngAfterViewInit(): void {
    console.log('here after view');
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
    console.log('here3');
    const result = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
    });

    console.log(result);
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
