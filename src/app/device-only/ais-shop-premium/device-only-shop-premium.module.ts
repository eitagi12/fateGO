import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOnlyShopPremiumRoutingModule } from './device-only-shop-premium-routing.module';
import { DeviceOnlyShopPremiumPaymentPageComponent } from './containers/device-only-shop-premium-payment-page/device-only-shop-premium-payment-page.component';
import { DeviceOnlyShopPremiumQueuePageComponent } from './containers/device-only-shop-premium-queue-page/device-only-shop-premium-queue-page.component';
import { DeviceOnlyShopPremiumResultPageComponent } from './containers/device-only-shop-premium-result-page/device-only-shop-premium-result-page.component';
import { DeviceOnlyShopPremiumQrCodeGeneratorPageComponent } from './containers/device-only-shop-premium-qr-code-generator-page/device-only-shop-premium-qr-code-generator-page.component';
import { DeviceOnlyShopPremiumAggregatePageComponent } from './containers/device-only-shop-premium-aggregate-page/device-only-shop-premium-aggregate-page.component';
import { DeviceOnlyShopPremiumQrCodeSummaryPageComponent } from './containers/device-only-shop-premium-qr-code-summary-page/device-only-shop-premium-qr-code-summary-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyShopPremiumRoutingModule
  ],
  declarations: [
    DeviceOnlyShopPremiumPaymentPageComponent,
    DeviceOnlyShopPremiumQueuePageComponent,
    DeviceOnlyShopPremiumResultPageComponent,
    DeviceOnlyShopPremiumQrCodeGeneratorPageComponent,
    DeviceOnlyShopPremiumAggregatePageComponent,
    DeviceOnlyShopPremiumQrCodeSummaryPageComponent
  ]
})
export class DeviceOnlyShopPremiumModule { }
