import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOnlyShopPremiumRoutingModule } from './device-only-shop-premium-routing.module';
import { DeviceOnlyShopPremiumPaymentPageComponent } from './containers/device-only-shop-premium-payment-page/device-only-shop-premium-payment-page.component';
import { DeviceOnlyShopPremiumResultPageComponent } from './containers/device-only-shop-premium-result-page/device-only-shop-premium-result-page.component';
import { DeviceOnlyShopPremiumQrCodeGeneratorPageComponent } from './containers/device-only-shop-premium-qr-code-generator-page/device-only-shop-premium-qr-code-generator-page.component';
import { DeviceOnlyShopPremiumAggregatePageComponent } from './containers/device-only-shop-premium-aggregate-page/device-only-shop-premium-aggregate-page.component';
import { DeviceOnlyShopPremiumQrCodeSummaryPageComponent } from './containers/device-only-shop-premium-qr-code-summary-page/device-only-shop-premium-qr-code-summary-page.component';
import { DeviceOnlyShopPremiumSummaryPageComponent } from './containers/device-only-shop-premium-summary-page/device-only-shop-premium-summary-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOnlySharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyShopPremiumRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    MyChannelSharedLibsModule,
    TranslateModule,
    DeviceOnlySharedModule
  ],
  declarations: [
    DeviceOnlyShopPremiumPaymentPageComponent,
    DeviceOnlyShopPremiumResultPageComponent,
    DeviceOnlyShopPremiumQrCodeGeneratorPageComponent,
    DeviceOnlyShopPremiumAggregatePageComponent,
    DeviceOnlyShopPremiumQrCodeSummaryPageComponent,
    DeviceOnlyShopPremiumSummaryPageComponent,
  ],
  providers: []
})
export class DeviceOnlyShopPremiumModule { }
