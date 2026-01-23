import { CdkAccordionItem } from '@angular/cdk/accordion';
import { AfterViewInit, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import gsap from 'gsap';
import Flip from 'gsap/Flip';
import Observer from 'gsap/Observer';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements AfterViewInit, OnDestroy {
  items = ['FAQ.QUESTION0', 'FAQ.QUESTION1', 'FAQ.QUESTION2', 'FAQ.QUESTION3', 'FAQ.QUESTION4'];
  expandedIndex = -1;

  subscriptions: Observer[] = [];
  @ViewChildren('accordionItem') accordionItems!: QueryList<CdkAccordionItem>;
  accordionElements: NodeListOf<Element>;
  /* accordionItem: CdkAccordionItem;
  accordionItems: NodeListOf<Element>; */

  constructor() {
    gsap.registerPlugin(Flip, Observer);
  }

  ngAfterViewInit(): void {
    console.log(this.accordionItems);
    this.accordionElements = document.querySelectorAll('.accordion-item');

    console.log(this.accordionElements);

    this.accordionElements.forEach((el, idx) => {
      const expandIcon = el.querySelector('div > mat-icon');
      const text = el.querySelector('div > span');
      this.subscriptions.push(
        Observer.create({
          target: el,
          type: 'pointer',
          onClick: () => this.toggleRow(idx),
          onHover: () => {
            if (this.expandedIndex === idx) {
              // block over on active idx
              return;
            }
            gsap.to(expandIcon, { rotate: 60, color: '#3aaaaa' });
            gsap.to(text, { color: '#3aaaaa' });
          },
          onHoverEnd: () => {
            if (this.expandedIndex === idx) {
              // block over on active idx
              return;
            }
            gsap.to(expandIcon, { rotate: 0, color: '#94A3B8' });
            gsap.to(text, { color: '#94A3B8' });
          },
        })
      );
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(el => el.kill());
  }

  toggleRow(idx: number): void {
    /* console.log(this.accordionItems.toArray()); */
    this.accordionItems.toArray()[idx].toggle();
    const el = this.accordionElements[idx];
    const expandIcon = el.querySelector('div > mat-icon');
    const text = el.querySelector('div > span');
    if (idx === this.expandedIndex) {
      // closing expansion
      this.expandedIndex = -1;
      gsap.to(expandIcon, { rotate: 0, color: '#94A3B8' });
      gsap.to(text, { color: '#94A3B8' });
      gsap.to(el, { borderBottomColor: 'inherit', borderBottomWidth: '2px' });
    } else if (this.expandedIndex >= 0) {
      // first remove styles from old expanded
      const oldExpanded = this.accordionElements[this.expandedIndex];
      const oldExpandedIcon = oldExpanded.querySelector('div > mat-icon');
      const oldText = oldExpanded.querySelector('div > span');

      gsap.to(oldExpandedIcon, { rotate: 0, color: '#94A3B8' });
      gsap.to(oldText, { color: '#94A3B8' });
      gsap.to(oldExpanded, { borderBottomColor: 'inherit', borderBottomWidth: '2px' });
      // apply new styles
      this.expandedIndex = idx;
      gsap.to(expandIcon, { rotate: 135, color: '#3aaaaa' });
      gsap.to(text, { color: '#3aaaaa' });
      gsap.to(el, { borderBottomColor: '#3aaaaa', borderBottomWidth: '2px' });
    } else {
      // apply new styles
      this.expandedIndex = idx;
      gsap.to(expandIcon, { rotate: 135, color: '#3aaaaa' });
      gsap.to(text, { color: '#3aaaaa' });
      gsap.to(el, { borderBottomColor: '#3aaaaa', borderBottomWidth: '2px' });
    }
  }
}
