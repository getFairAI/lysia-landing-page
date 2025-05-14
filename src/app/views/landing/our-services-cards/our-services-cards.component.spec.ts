import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurServicesCardsComponent } from './our-services-cards.component';

describe('OurServicesCardsComponent', () => {
  let component: OurServicesCardsComponent;
  let fixture: ComponentFixture<OurServicesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurServicesCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurServicesCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
