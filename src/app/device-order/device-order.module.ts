import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { DeviceOrderRoutingModule } from './device-order-routing.module';
import { DeviceOrderComponent } from './device-order.component';
import { PromotionShelveService } from './services/promotion-shelve.service';
import { MobileCareService } from './services/mobile-care.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { IdCardPipe } from 'mychannel-shared-libs';
import { EligibleMobileService } from './services/eligible-mobile.service';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderRoutingModule,
  ],
  providers: [
    PromotionShelveService,
    MobileCareService,
    ShoppingCartService,
    EligibleMobileService,
    IdCardPipe,
    DecimalPipe
  ],
  declarations: [DeviceOrderComponent]
})
export class DeviceOrderModule { }
