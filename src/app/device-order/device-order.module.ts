import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderRoutingModule } from './device-order-routing.module';
import { DeviceOrderComponent } from './device-order.component';
import { PromotionShelveService } from './services/promotion-shelve.service';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderRoutingModule
  ],
  providers: [
    PromotionShelveService
  ],
  declarations: [DeviceOrderComponent]
})
export class DeviceOrderModule { }
