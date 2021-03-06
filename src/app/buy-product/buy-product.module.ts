import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
/* Service */
import { FlowService } from './services/flow.service';
/* Components */
import { BuyProductRoutingModule } from './buy-product-routing.module';
import { BrandPageComponent } from './containers/brand-page/brand-page.component';
import { CampaignPageComponent } from './containers/campaign-page/campaign-page.component';
import { ProductPageComponent } from './containers/product-page/product-page.component';
import { PrivilegeToTradeSliderPipe } from './pipes/privilege-to-trade-slider.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    BuyProductRoutingModule,
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    TranslateModule,
  ],
  declarations: [
    BrandPageComponent,
    CampaignPageComponent,
    ProductPageComponent,
    PrivilegeToTradeSliderPipe,
  ],
  providers: [
    FlowService
  ]
})
export class BuyProductModule { }
