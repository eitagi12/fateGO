import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisExistingPrepaidHotdealRoutingModule } from './device-order-ais-existing-prepaid-hotdeal-routing.module';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-page.component';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-repi-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-summary-page/device-order-ais-existing-prepaid-hotdeal-summary-page.component';
import { DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-select-package-page/device-order-ais-existing-prepaid-hotdeal-select-package-page.component';
import { DeviceOrderAisExistingPrepaidHotdealResultPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-result-page/device-order-ais-existing-prepaid-hotdeal-result-page.component';
import { DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-payment-detail-page/device-order-ais-existing-prepaid-hotdeal-payment-detail-page.component';
import { DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-mobile-care-page/device-order-ais-existing-prepaid-hotdeal-mobile-care-page.component';
import { DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page/device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component';
import { DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-customer-info-page/device-order-ais-existing-prepaid-hotdeal-customer-info-page.component';
import { DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-aggregate-page/device-order-ais-existing-prepaid-hotdeal-aggregate-page.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingPrepaidHotdealRoutingModule,
    MyChannelSharedLibsModule
  ],
  declarations: [
    DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent,
    DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent,
    DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent,
    DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent,
    DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent,
    DeviceOrderAisExistingPrepaidHotdealResultPageComponent,
    DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent,
    DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent,
    DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent,
    DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent,
    DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent
  ]
})
export class DeviceOrderAisExistingPrepaidHotdealModule {}
