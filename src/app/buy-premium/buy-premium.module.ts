import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyPremiumRoutingModule } from './buy-premium-routing.module';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { PrivilegeToTradeSliderPipe } from './pipes/privilege-to-trade-slider.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { FlowService } from './services/flow.service';

@NgModule({
  imports: [
    CommonModule,
    BuyPremiumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TypeaheadModule.forRoot(),
    TabsModule.forRoot()
  ],
  declarations: [
    BrandPageComponent,
    CampaignPageComponent,
    ProductPageComponent,
    PrivilegeToTradeSliderPipe
  ],
  providers: [
    FlowService
  ]
})
export class BuyPremiumModule { }
