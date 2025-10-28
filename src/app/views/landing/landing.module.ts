import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamComponent } from './team/team.component';
import { OurTechStackComponent } from './our-tech-stack/our-tech-stack.component';
import { ContactUsCardsComponent } from './contact-us-cards/contact-us-cards.component';
import { BigDescriptionCardsComponent } from './big-description-cards/big-description-cards.component';
import { OurServicesCardsComponent } from './our-services-cards/our-services-cards.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LandingRoutingModule } from './landing-routing.module';
import { WowDemoComponent } from './wow-demo/wow-demo.component';
import { LandingComponent } from './landing.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from 'src/app/components/footers/footer/footer.component';

@NgModule({
  declarations: [LandingComponent, TeamComponent, OurTechStackComponent, ContactUsCardsComponent, BigDescriptionCardsComponent, OurServicesCardsComponent, WowDemoComponent, FooterComponent],
  imports: [
    CommonModule,
    SharedModule,
    LandingRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [LandingComponent, WowDemoComponent],
})
export class LandingPageModule {}
