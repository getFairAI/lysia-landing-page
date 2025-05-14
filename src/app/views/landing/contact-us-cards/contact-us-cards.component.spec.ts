import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsCardsComponent } from './contact-us-cards.component';

describe('ContactUsCardsComponent', () => {
  let component: ContactUsCardsComponent;
  let fixture: ComponentFixture<ContactUsCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactUsCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
