import { Component } from '@angular/core';

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
