import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyAccessoriesRoutingModule } from './buy-accessories-routing.module';
import { PrivilegeToTradeSliderPipe } from './pipes/privilege-to-trade-slider.pipe';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';

@NgModule({
  imports: [
    CommonModule,
    BuyAccessoriesRoutingModule
  ],
  declarations: [PrivilegeToTradeSliderPipe, BrandPageComponent, CampaignPageComponent, ProductPageComponent]
})
export class BuyAccessoriesModule { }
