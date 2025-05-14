import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  styleUrl: './landing.component.scss',
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
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

  formGroupContactUs = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required, Validators.maxLength(4000)]),
  });

  constructor(private translateService: TranslateService) {}

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
      },
      error: error => {
        console.log(error);
      },
    });
  }

  scrollRight() {
    let element = document.getElementById('scrollable-div');
    let cardReference = document.getElementById('card-scroll-reference');
    element.scrollLeft += cardReference.clientWidth + 30;
  }

  scrollLeft() {
    let element = document.getElementById('scrollable-div');
    let cardReference = document.getElementById('card-scroll-reference');
    element.scrollLeft -= cardReference.clientWidth + 30;
  }

  scrollDownLearnMore() {
    let cardsSection = document.getElementById('cards-section');
    cardsSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'center',
    });
  }

  openLinkNewTab(linkUrl: string) {
    window.open(linkUrl, '_blank');
  }

  submitContactForm() {
    if (this.formGroupContactUs.valid) {
    }
  }
}
