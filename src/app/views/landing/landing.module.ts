import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team/team.component';
import { OurTechStackComponent } from './our-tech-stack/our-tech-stack.component';
import { ContactUsCardsComponent } from './contact-us-cards/contact-us-cards.component';
import { BigDescriptionCardsComponent } from './big-description-cards/big-description-cards.component';
import { OurServicesCardsComponent } from './our-services-cards/our-services-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingRoutingModule } from './landing-routing.module';

@NgModule({
  declarations: [TeamComponent, OurTechStackComponent, ContactUsCardsComponent, BigDescriptionCardsComponent, OurServicesCardsComponent],
  imports: [CommonModule, SharedModule, LandingRoutingModule],
})
export class LandingPageModule {}
