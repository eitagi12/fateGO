import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-page.component';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-repi-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-summary-page/device-order-ais-existing-prepaid-hotdeal-summary-page.component';
import { DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-select-package-page/device-order-ais-existing-prepaid-hotdeal-select-package-page.component';
import { DeviceOrderAisExistingPrepaidHotdealResultPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-result-page/device-order-ais-existing-prepaid-hotdeal-result-page.component';
import { DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-payment-detail-page/device-order-ais-existing-prepaid-hotdeal-payment-detail-page.component';
import { DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-mobile-care-page/device-order-ais-existing-prepaid-hotdeal-mobile-care-page.component';
import { DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page/device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component';
import { DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-customer-info-page/device-order-ais-existing-prepaid-hotdeal-customer-info-page.component';
import { DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-aggregate-page/device-order-ais-existing-prepaid-hotdeal-aggregate-page.component';
import { DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-customer-profile-page/device-order-ais-existing-prepaid-hotdeal-customer-profile-page.component';
import { DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-mobile-care-available-page/device-order-ais-existing-prepaid-hotdeal-mobile-care-available-page.component';
import { DeviceOrderAisExistingPrepaidHotdealOtpPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-otp-page/device-order-ais-existing-prepaid-hotdeal-otp-page.component';
import { DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-validate-customer-repi-page/device-order-ais-existing-prepaid-hotdeal-validate-customer-repi-page.component';
import { DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-qr-code-generator-page/device-order-ais-existing-prepaid-hotdeal-qr-code-generator-page.component';
import { DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-qr-code-queue-page/device-order-ais-existing-prepaid-hotdeal-qr-code-queue-page.component';
import { DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-qr-code-queue-summary-page/device-order-ais-existing-prepaid-hotdeal-qr-code-queue-summary-page.component';
import { DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-qr-code-summary-page/device-order-ais-existing-prepaid-hotdeal-qr-code-summary-page.component';
import { DeviceOrderAisExistingPrepaidHotdealQueuePageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-queue-page/device-order-ais-existing-prepaid-hotdeal-queue-page.component';
import { DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent } from './containers/device-order-ais-existing-prepaid-hotdeal-qr-code-result-page/device-order-ais-existing-prepaid-hotdeal-qr-code-result-page.component';

const routes: Routes = [
  {
    path: 'validate-customer',
    component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerPageComponent
  },
  {
    path: 'validate-customer-id-card',
    component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardPageComponent
  },
  {
    path: 'validate-customer-id-card-repi',
    component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerIdCardRepiPageComponent
  },
  {
    path: 'summary',
    component: DeviceOrderAisExistingPrepaidHotdealSummaryPageComponent
  },
  {
    path: 'select-package',
    component: DeviceOrderAisExistingPrepaidHotdealSelectPackagePageComponent
  },
  {
    path: 'result',
    component: DeviceOrderAisExistingPrepaidHotdealResultPageComponent
  },
  {
    path: 'payment-detail',
    component: DeviceOrderAisExistingPrepaidHotdealPaymentDetailPageComponent
  },
  {
    path: 'mobile-care',
    component: DeviceOrderAisExistingPrepaidHotdealMobileCarePageComponent
  },
  {
    path: 'eligible-mobile',
    component: DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent
  },
  {
    path: 'customer-info',
    component: DeviceOrderAisExistingPrepaidHotdealCustomerInfoPageComponent
  },
  {
    path: 'aggregate',
    component: DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent
  },
  {
    path: 'customer-profile',
    component: DeviceOrderAisExistingPrepaidHotdealCustomerProfilePageComponent
  },
  {
    path: 'mobile-care-available',
    component: DeviceOrderAisExistingPrepaidHotdealMobileCareAvailablePageComponent
  },
  {
    path: 'otp',
    component: DeviceOrderAisExistingPrepaidHotdealOtpPageComponent
  },
  {
    path: 'validate-customer-repi',
    component: DeviceOrderAisExistingPrepaidHotdealValidateCustomerRepiPageComponent
  },
  {
    path: 'qr-code-generator',
    component: DeviceOrderAisExistingPrepaidHotdealQrCodeGeneratorPageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOrderAisExistingPrepaidHotdealQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-queue-summary',
    component: DeviceOrderAisExistingPrepaidHotdealQrCodeQueueSummaryPageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOrderAisExistingPrepaidHotdealQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-result',
    component: DeviceOrderAisExistingPrepaidHotdealQrCodeResultPageComponent
  },
  {
    path: 'queue',
    component: DeviceOrderAisExistingPrepaidHotdealQueuePageComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingPrepaidHotdealRoutingModule { }
