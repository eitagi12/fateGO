import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent } from './containers/device-order-ais-prepaid-hotdeal-validate-customer-page/device-order-ais-prepaid-hotdeal-validate-customer-page.component';
import { DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent } from './containers/device-order-ais-prepaid-hotdeal-validate-customer-id-card-page/device-order-ais-prepaid-hotdeal-validate-customer-id-card-page.component';
import { DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent } from './containers/device-order-ais-prepaid-hotdeal-eligible-mobile-page/device-order-ais-prepaid-hotdeal-eligible-mobile-page.component';
import { DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent } from './containers/device-order-ais-prepaid-hotdeal-customer-info-page/device-order-ais-prepaid-hotdeal-customer-info-page.component';
import { DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent } from './containers/device-order-ais-prepaid-hotdeal-payment-detail-page/device-order-ais-prepaid-hotdeal-payment-detail-page.component';
import { DeviceOrderAisPrepaidHotdealSelectPackagePageComponent } from './containers/device-order-ais-prepaid-hotdeal-select-package-page/device-order-ais-prepaid-hotdeal-select-package-page.component';
import { DeviceOrderAisPrepaidHotdealMobileCarePageComponent } from './containers/device-order-ais-prepaid-hotdeal-mobile-care-page/device-order-ais-prepaid-hotdeal-mobile-care-page.component';
import { DeviceOrderAisPrepaidHotdealSummaryPageComponent } from './containers/device-order-ais-prepaid-hotdeal-summary-page/device-order-ais-prepaid-hotdeal-summary-page.component';
import { DeviceOrderAisPrepaidHotdealAggregatePageComponent } from './containers/device-order-ais-prepaid-hotdeal-aggregate-page/device-order-ais-prepaid-hotdeal-aggregate-page.component';
import { DeviceOrderAisPrepaidHotdealResultPageComponent } from './containers/device-order-ais-prepaid-hotdeal-result-page/device-order-ais-prepaid-hotdeal-result-page.component';
import { DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-prepaid-hotdeal-validate-customer-id-card-repi-page/device-order-ais-prepaid-hotdeal-validate-customer-id-card-repi-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer-id-card', pathMatch: 'full' },
  { path: 'validate-customer', component: DeviceOrderAisPrepaidHotdealValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: DeviceOrderAisPrepaidHotdealValidateCustomerIdCardPageComponent },
  { path: 'validate-customer-id-card-repi', component: DeviceOrderAisPrepaidHotdealValidateCustomerIdCardRepiPageComponent },
  { path: 'eligible-mobile', component: DeviceOrderAisPrepaidHotdealEligibleMobilePageComponent },
  { path: 'customer-info', component: DeviceOrderAisPrepaidHotdealCustomerInfoPageComponent },
  { path: 'payment-detail', component: DeviceOrderAisPrepaidHotdealPaymentDetailPageComponent },
  { path: 'select-package', component: DeviceOrderAisPrepaidHotdealSelectPackagePageComponent },
  { path: 'mobile-care', component: DeviceOrderAisPrepaidHotdealMobileCarePageComponent },
  { path: 'summary', component: DeviceOrderAisPrepaidHotdealSummaryPageComponent },
  { path: 'aggregate', component: DeviceOrderAisPrepaidHotdealAggregatePageComponent },
  { path: 'result', component: DeviceOrderAisPrepaidHotdealResultPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisPrepaidHotdealRoutingModule { }
