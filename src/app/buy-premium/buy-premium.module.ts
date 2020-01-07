import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyPremiumRoutingModule } from './buy-premium-routing.module';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { PrivilegeToTradeSliderPipe } from './pipes/privilege-to-trade-slider.pipe';

@NgModule({
  imports: [
    CommonModule,
    BuyPremiumRoutingModule
  ],
  declarations: [BrandPageComponent, CampaignPageComponent, ProductPageComponent, PrivilegeToTradeSliderPipe]
})
export class BuyPremiumModule { }
