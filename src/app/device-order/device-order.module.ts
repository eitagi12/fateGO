import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderRoutingModule } from './device-order-routing.module';
import { DeviceOrderComponent } from './device-order.component';
import { MobileCareService } from './services/mobile-care.service';
import { ShoppingCartService } from './services/shopping-cart.service';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderRoutingModule
  ],
  declarations: [DeviceOrderComponent],
  providers: [
    MobileCareService,
    ShoppingCartService
  ]
})
export class DeviceOrderModule { }
