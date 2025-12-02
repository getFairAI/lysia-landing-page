import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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
export class CalendlyWidgetComponent implements OnInit {
  @ViewChild('container') container: ElementRef;

  ngOnInit() {
    const script = document.getElementById('calendly-script');
    if (script && !!window.Calendly) {
      // script already loaded
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/getfairai/30min' + '?text_color=464646&' + 'primary_color=3aaaaa&' + 'background_color=f8fafc&' + 'hide_gdpr_banner=1&' + 'hide_event_type_details=1',
        parentElement: document.getElementById('calendly-embed'),
        prefill: {},
        utm: {},
      });
    } else if (script) {
      script.onload = () => {
        window.Calendly.initInlineWidget({
          url: 'https://calendly.com/getfairai/30min' + '?text_color=464646&' + 'primary_color=3aaaaa&' + 'background_color=f8fafc&' + 'hide_gdpr_banner=1&' + 'hide_event_type_details=1',
          parentElement: document.getElementById('calendly-embed'),
          prefill: {},
          utm: {},
        });
      };
    }
  }
}
