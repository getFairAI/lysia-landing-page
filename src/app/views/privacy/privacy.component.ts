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
import ScrollToPlugin from 'gsap/ScrollToPlugin';

@Component({
  selector: 'app-privacy',
  styleUrl: './privacy.component.scss',
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent {
  isReady = false;
  styles = `.c26 {
    background-color: transparent !important;
    padding-bottom: 0px !important;
  }
  html {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: transparent !important;
  }`;

  onIframeLoaded() {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      const iframeDoc = iframe.contentDocument;
      if (iframeDoc) {
        const style = iframeDoc.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = this.styles;
        iframeDoc.head.appendChild(style);
        this.isReady = true
      }
    }
  }
}
