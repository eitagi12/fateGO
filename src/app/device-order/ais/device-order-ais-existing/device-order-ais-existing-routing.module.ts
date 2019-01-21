import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingValidateCustomerPageComponent } from './containers/device-order-ais-existing-validate-customer-page/device-order-ais-existing-validate-customer-page.component';
import { DeviceOrderAisExistingPaymentDetailPageComponent } from './containers/device-order-ais-existing-payment-detail-page/device-order-ais-existing-payment-detail-page.component';
import { DeviceOrderAisExistingCustomerInfoPageComponent } from './containers/device-order-ais-existing-customer-info-page/device-order-ais-existing-customer-info-page.component';
import { DeviceOrderAisExistingSelectPackagePageComponent } from './containers/device-order-ais-existing-select-package-page/device-order-ais-existing-select-package-page.component';
import { DeviceOrderAisExistingMobileCarePageComponent } from './containers/device-order-ais-existing-mobile-care-page/device-order-ais-existing-mobile-care-page.component';
import { DeviceOrderAisExistingSummaryPageComponent } from './containers/device-order-ais-existing-summary-page/device-order-ais-existing-summary-page.component';
import { DeviceOrderAisExistingAgreementPageComponent } from './containers/device-order-ais-existing-agreement-page/device-order-ais-existing-agreement-page.component';
import { DeviceOrderAisExistingAgreementSignPageComponent } from './containers/device-order-ais-existing-agreement-sign-page/device-order-ais-existing-agreement-sign-page.component';
import { DeviceOrderAisExistingResultPageComponent } from './containers/device-order-ais-existing-result-page/device-order-ais-existing-result-page.component';
import { DeviceOrderAisExistingValidateCustomerKeyInPageComponent } from './containers/device-order-ais-existing-validate-customer-key-in-page/device-order-ais-existing-validate-customer-key-in-page.component';
import { DeviceOrderAisExistingValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-validate-customer-id-card-page/device-order-ais-existing-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingEligibleMobilePageComponent } from './containers/device-order-ais-existing-eligible-mobile-page/device-order-ais-existing-eligible-mobile-page.component';
import { DeviceOrderAisExistingChangePackagePageComponent } from './containers/device-order-ais-existing-change-package-page/device-order-ais-existing-change-package-page.component';
import { DeviceOrderAisExistingMobileDetailPageComponent } from './containers/device-order-ais-existing-mobile-detail-page/device-order-ais-existing-mobile-detail-page.component';
import { DeviceOrderAisExistingEffectiveStartDatePageComponent } from './containers/device-order-ais-existing-effective-start-date-page/device-order-ais-existing-effective-start-date-page.component';
import { DeviceOrderAisExistingAggregatePageComponent } from './containers/device-order-ais-existing-aggregate-page/device-order-ais-existing-aggregate-page.component';
import { DeviceOrderAisExistingQueuePageComponent } from './containers/device-order-ais-existing-queue-page/device-order-ais-existing-queue-page.component';

const routes: Routes = [
  {
    path: 'validate-customer',
    component: DeviceOrderAisExistingValidateCustomerPageComponent
  },
  {
    path: 'validate-customer-key-in',
    component: DeviceOrderAisExistingValidateCustomerKeyInPageComponent
  },
  {
    path: 'validate-customer-id-card',
    component: DeviceOrderAisExistingValidateCustomerIdCardPageComponent
  },
  {
    path: 'customer-info',
    component: DeviceOrderAisExistingCustomerInfoPageComponent
  },
  {
    path: 'eligible-mobile',
    component: DeviceOrderAisExistingEligibleMobilePageComponent
  },
  {
    path: 'change-package',
    component: DeviceOrderAisExistingChangePackagePageComponent
  },
  {
    path: 'mobile-detail',
    component: DeviceOrderAisExistingMobileDetailPageComponent
  },
  {
    path: 'payment-detail',
    component: DeviceOrderAisExistingPaymentDetailPageComponent
  },
  {
    path: 'select-package',
    component: DeviceOrderAisExistingSelectPackagePageComponent
  },
  {
    path: 'effective-start-date',
    component: DeviceOrderAisExistingEffectiveStartDatePageComponent
  },
  {
    path: 'mobile-care',
    component: DeviceOrderAisExistingMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOrderAisExistingSummaryPageComponent
  },
  {
    path: 'agreement',
    component: DeviceOrderAisExistingAgreementPageComponent
  },
  {
    path: 'agreement-sign',
    component: DeviceOrderAisExistingAgreementSignPageComponent
  },
  {
    path: 'aggregate',
    component: DeviceOrderAisExistingAggregatePageComponent
  },
  {
    path: 'queue',
    component: DeviceOrderAisExistingQueuePageComponent
  },
  {
    path: 'result',
    component: DeviceOrderAisExistingResultPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingRoutingModule { }
