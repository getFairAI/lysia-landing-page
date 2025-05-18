import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogInfoCardsComponent } from './dialog-info-cards.component';

describe('DialogInfoCardsComponent', () => {
  let component: DialogInfoCardsComponent;
  let fixture: ComponentFixture<DialogInfoCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogInfoCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DialogInfoCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
