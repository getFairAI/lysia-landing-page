import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurTechStackComponent } from './our-tech-stack.component';

describe('OurTechStackComponent', () => {
  let component: OurTechStackComponent;
  let fixture: ComponentFixture<OurTechStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurTechStackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OurTechStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
