import { Component, ElementRef, ViewChild } from '@angular/core';

declare global {
  interface Window {
    Calendly: any;
  }
}

@Component({
  selector: 'app-calendly-widget',
  templateUrl: './calendly-widget.component.html',
  styleUrl: './calendly-widget.component.scss',
})
export class CalendlyWidgetComponent {
  @ViewChild('container') container: ElementRef;

  ngOnInit() {
    window.Calendly.initInlineWidget({
      url: 'https://calendly.com/lysialabs/30min',
      parentElement: document.getElementById('calendly-embed'),
      prefill: {},
      utm: {},
    });
  }
}
