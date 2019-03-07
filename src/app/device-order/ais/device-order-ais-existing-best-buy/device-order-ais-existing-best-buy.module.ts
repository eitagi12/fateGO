import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';

import { DeviceOrderAisExistingBestBuyRoutingModule } from './device-order-ais-existing-best-buy-routing.module';
import { DeviceOrderAisExistingBestBuyCheckOutPageComponent } from './containers/device-order-ais-existing-best-buy-check-out-page/device-order-ais-existing-best-buy-check-out-page.component';
import { DeviceOrderAisExistingBestBuyCustomerInfoPageComponent } from './containers/device-order-ais-existing-best-buy-customer-info-page/device-order-ais-existing-best-buy-customer-info-page.component';
import { DeviceOrderAisExistingBestBuyEligibleMobilePageComponent } from './containers/device-order-ais-existing-best-buy-eligible-mobile-page/device-order-ais-existing-best-buy-eligible-mobile-page.component';
import { DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent } from './containers/device-order-ais-existing-best-buy-mobile-care-available-page/device-order-ais-existing-best-buy-mobile-care-available-page.component';
import { DeviceOrderAisExistingBestBuyMobileCarePageComponent } from './containers/device-order-ais-existing-best-buy-mobile-care-page/device-order-ais-existing-best-buy-mobile-care-page.component';
import { DeviceOrderAisExistingBestBuyMobileDetailPageComponent } from './containers/device-order-ais-existing-best-buy-mobile-detail-page/device-order-ais-existing-best-buy-mobile-detail-page.component';
import { DeviceOrderAisExistingBestBuyPaymentDetailPageComponent } from './containers/device-order-ais-existing-best-buy-payment-detail-page/device-order-ais-existing-best-buy-payment-detail-page.component';
import { DeviceOrderAisExistingBestBuyQueuePageComponent } from './containers/device-order-ais-existing-best-buy-queue-page/device-order-ais-existing-best-buy-queue-page.component';
import { DeviceOrderAisExistingBestBuyResultPageComponent } from './containers/device-order-ais-existing-best-buy-result-page/device-order-ais-existing-best-buy-result-page.component';
import { DeviceOrderAisExistingBestBuySummaryPageComponent } from './containers/device-order-ais-existing-best-buy-summary-page/device-order-ais-existing-best-buy-summary-page.component';
import { DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-best-buy-validate-customer-id-card-page/device-order-ais-existing-best-buy-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent } from './containers/device-order-ais-existing-best-buy-validate-customer-key-in-page/device-order-ais-existing-best-buy-validate-customer-key-in-page.component';
import { DeviceOrderAisExistingBestBuyValidateCustomerPageComponent } from './containers/device-order-ais-existing-best-buy-validate-customer-page/device-order-ais-existing-best-buy-validate-customer-page.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent } from './containers/device-order-ais-existing-best-buy-validate-customer-repi-page/device-order-ais-existing-best-buy-validate-customer-repi-page.component';
import { DeviceOrderAisExistingBestBuyCustomerProfilePageComponent } from './containers/device-order-ais-existing-best-buy-customer-profile-page/device-order-ais-existing-best-buy-customer-profile-page.component';
import { DeviceOrderAisExistingBestBuyOtpPageComponent } from './containers/device-order-ais-existing-best-buy-otp-page/device-order-ais-existing-best-buy-otp-page.component';
import { CreateDeviceOrderBestBuyService } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/service/create-device-order-best-buy.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    DeviceOrderAisExistingBestBuyRoutingModule
  ],
  declarations: [
    DeviceOrderAisExistingBestBuyCheckOutPageComponent,
    DeviceOrderAisExistingBestBuyCustomerInfoPageComponent,
    DeviceOrderAisExistingBestBuyEligibleMobilePageComponent,
    DeviceOrderAisExistingBestBuyMobileCareAvailablePageComponent,
    DeviceOrderAisExistingBestBuyMobileCarePageComponent,
    DeviceOrderAisExistingBestBuyMobileDetailPageComponent,
    DeviceOrderAisExistingBestBuyPaymentDetailPageComponent,
    DeviceOrderAisExistingBestBuyQueuePageComponent,
    DeviceOrderAisExistingBestBuyResultPageComponent,
    DeviceOrderAisExistingBestBuySummaryPageComponent,
    DeviceOrderAisExistingBestBuyValidateCustomerIdCardPageComponent,
    DeviceOrderAisExistingBestBuyValidateCustomerKeyInPageComponent,
    DeviceOrderAisExistingBestBuyValidateCustomerPageComponent,
    DeviceOrderAisExistingBestBuyValidateCustomerRepiPageComponent,
    DeviceOrderAisExistingBestBuyCustomerProfilePageComponent,
    DeviceOrderAisExistingBestBuyOtpPageComponent
  ],
  providers: [
    CreateDeviceOrderBestBuyService
  ]
})
export class DeviceOrderAisExistingBestBuyModule { }
