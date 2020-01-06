import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOnlyShopPremiumRoutingModule } from './device-only-shop-premium-routing.module';
import { DeviceOnlyShopPremiumPaymentPageComponent } from './containers/device-only-shop-premium-payment-page/device-only-shop-premium-payment-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyShopPremiumRoutingModule
  ],
  declarations: [DeviceOnlyShopPremiumPaymentPageComponent]
})
export class DeviceOnlyShopPremiumModule { }
