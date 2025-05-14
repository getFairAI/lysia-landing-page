import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigDescriptionCardsComponent } from './big-description-cards.component';

describe('BigDescriptionCardsComponent', () => {
  let component: BigDescriptionCardsComponent;
  let fixture: ComponentFixture<BigDescriptionCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigDescriptionCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BigDescriptionCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
