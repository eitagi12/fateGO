import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyAccessoriesRoutingModule } from './buy-accessories-routing.module';
import { PrivilegeToTradeSliderPipe } from './pipes/privilege-to-trade-slider.pipe';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { FlowService } from 'src/app/buy-accessories/services/flow.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TypeaheadModule, TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    BuyAccessoriesRoutingModule,
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
export class BuyAccessoriesModule { }
