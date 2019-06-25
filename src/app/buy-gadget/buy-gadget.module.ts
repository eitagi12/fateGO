import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyGadgetRoutingModule } from './buy-gadget-routing.module';
import { PrivilegeToTradeSliderPipe } from './pipes/privilege-to-trade-slider.pipe';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { FlowService } from './services/flow.service';

@NgModule({
  imports: [
    CommonModule,
    BuyGadgetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TypeaheadModule.forRoot(),
    TabsModule.forRoot()
  ],
  declarations: [
    PrivilegeToTradeSliderPipe,
    BrandPageComponent,
    CampaignPageComponent,
    ProductPageComponent
  ],
  providers: [
    FlowService
  ]
})
export class BuyGadgetModule { }
