import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrl: './footer.component.scss',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  date = new Date().getFullYear();
  constructor() {}

  openLinkNewTab(linkUrl: string) {
    window.open(linkUrl, '_blank');
  }
}
