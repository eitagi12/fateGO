import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent } from './containers/device-order-ais-prepaid-hotdeal-eligible-mobile-page/device-order-ais-prepaid-hotdeal-eligible-mobile-page.component';
import { DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent } from './containers/device-order-ais-prepaid-hotdeal-customer-info-page/device-order-ais-prepaid-hotdeal-customer-info-page.component';
import { DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent } from './containers/device-order-ais-prepaid-hotdeal-payment-detail-page/device-order-ais-prepaid-hotdeal-payment-detail-page.component';
import { DeviceOrderAisPrepaidHotdealSelectPackagePageComponent } from './containers/device-order-ais-prepaid-hotdeal-select-package-page/device-order-ais-prepaid-hotdeal-select-package-page.component';
import { DeviceOrderAisPrepaidHotdealMobileCarePageComponent } from './containers/device-order-ais-prepaid-hotdeal-mobile-care-page/device-order-ais-prepaid-hotdeal-mobile-care-page.component';
import { DeviceOrderAisPrepaidHotdealSummaryPageComponent } from './containers/device-order-ais-prepaid-hotdeal-summary-page/device-order-ais-prepaid-hotdeal-summary-page.component';
import { DeviceOrderAisPrepaidHotdealAggregatePageComponent } from './containers/device-order-ais-prepaid-hotdeal-aggregate-page/device-order-ais-prepaid-hotdeal-aggregate-page.component';
import { DeviceOrderAisPrepaidHotdealResultPageComponent } from './containers/device-order-ais-prepaid-hotdeal-result-page/device-order-ais-prepaid-hotdeal-result-page.component';
import { DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent } from './containers/device-order-ais-prepaid-hotdeal-validate-customer-page/device-order-ais-prepaid-hotdeal-validate-customer-page.component';
import { DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent } from './containers/device-order-ais-prepaid-hotdeal-validate-customer-id-card-page/device-order-ais-prepaid-hotdeal-validate-customer-id-card-page.component';
import { DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-prepaid-hotdeal-validate-customer-id-card-repi-page/device-order-ais-prepaid-hotdeal-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisPrepaidHotdealRoutingModule } from './device-order-ais-prepaid-hotdeal-routing.module';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisPrepaidHotdealRoutingModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent,
    DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent,
    DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent,
    DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent,
    DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent,
    DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent,
    DeviceOrderAisPrepaidHotdealSelectPackagePageComponent,
    DeviceOrderAisPrepaidHotdealMobileCarePageComponent,
    DeviceOrderAisPrepaidHotdealSummaryPageComponent,
    DeviceOrderAisPrepaidHotdealAggregatePageComponent,
    DeviceOrderAisPrepaidHotdealResultPageComponent
  ]
})
export class DeviceOrderAisPrepaidHotdealModule {}
