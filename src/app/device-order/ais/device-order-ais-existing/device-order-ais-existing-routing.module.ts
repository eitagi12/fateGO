import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingValidateCustomerPageComponent } from './containers/device-order-ais-existing-validate-customer-page/device-order-ais-existing-validate-customer-page.component';
import { DeviceOrderAisExistingPaymentDetailPageComponent } from './containers/device-order-ais-existing-payment-detail-page/device-order-ais-existing-payment-detail-page.component';
import { DeviceOrderAisExistingCustomerInfoPageComponent } from './containers/device-order-ais-existing-customer-info-page/device-order-ais-existing-customer-info-page.component';
import { DeviceOrderAisExistingSelectPackagePageComponent } from './containers/device-order-ais-existing-select-package-page/device-order-ais-existing-select-package-page.component';
import { DeviceOrderAisExistingMobileCareAvailablePageComponent } from './containers/device-order-ais-existing-mobile-care-available-page/device-order-ais-existing-mobile-care-available-page.component';
import { DeviceOrderAisExistingMobileCarePageComponent } from './containers/device-order-ais-existing-mobile-care-page/device-order-ais-existing-mobile-care-page.component';
import { DeviceOrderAisExistingSummaryPageComponent } from './containers/device-order-ais-existing-summary-page/device-order-ais-existing-summary-page.component';
import { DeviceOrderAisExistingAgreementSignPageComponent } from './containers/device-order-ais-existing-agreement-sign-page/device-order-ais-existing-agreement-sign-page.component';
import { DeviceOrderAisExistingResultPageComponent } from './containers/device-order-ais-existing-result-page/device-order-ais-existing-result-page.component';
import { DeviceOrderAisExistingValidateCustomerKeyInPageComponent } from './containers/device-order-ais-existing-validate-customer-key-in-page/device-order-ais-existing-validate-customer-key-in-page.component';
import { DeviceOrderAisExistingValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-validate-customer-id-card-page/device-order-ais-existing-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingEligibleMobilePageComponent } from './containers/device-order-ais-existing-eligible-mobile-page/device-order-ais-existing-eligible-mobile-page.component';
import { DeviceOrderAisExistingChangePackagePageComponent } from './containers/device-order-ais-existing-change-package-page/device-order-ais-existing-change-package-page.component';
import { DeviceOrderAisExistingMobileDetailPageComponent } from './containers/device-order-ais-existing-mobile-detail-page/device-order-ais-existing-mobile-detail-page.component';
import { DeviceOrderAisExistingEffectiveStartDatePageComponent } from './containers/device-order-ais-existing-effective-start-date-page/device-order-ais-existing-effective-start-date-page.component';
import { DeviceOrderAisExistingQueuePageComponent } from './containers/device-order-ais-existing-queue-page/device-order-ais-existing-queue-page.component';
import { DeviceOrderAisExistingQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-qr-code-summary-page/device-order-ais-existing-qr-code-summary-page.component';
import { DeviceOrderAisExistingQrCodeGeneratorPageComponent } from './containers/device-order-ais-existing-qr-code-generator-page/device-order-ais-existing-qr-code-generator-page.component';
import { DeviceOrderAisExistingQrCodeQueuePageComponent } from './containers/device-order-ais-existing-qr-code-queue-page/device-order-ais-existing-qr-code-queue-page.component';
import { DeviceOrderAisExistingOneLovePageComponent } from './containers/device-order-ais-existing-one-love-page/device-order-ais-existing-one-love-page.component';
import { DeviceOrderAisExistingMergeBillingPageComponent } from './containers/device-order-ais-existing-merge-billing-page/device-order-ais-existing-merge-billing-page.component';
import { DeviceOrderAisExistingEcontractPageComponent } from './containers/device-order-ais-existing-econtract-page/device-order-ais-existing-econtract-page.component';
import { DeviceOrderAisExistingNonPackagePageComponent } from './containers/device-order-ais-existing-non-package-page/device-order-ais-existing-non-package-page.component';
import { DeviceOrderAisExistingAggregatePageComponent } from './containers/device-order-ais-existing-aggregate-page/device-order-ais-existing-aggregate-page.component';
import { DeviceOrderAisExistingSelectPackageOntopPageComponent } from './containers/device-order-ais-existing-select-package-ontop-page/device-order-ais-existing-select-package-ontop-page.component';
import { DeviceOrderAisExistingQrCodeResultPageComponent } from './containers/device-order-ais-existing-qr-code-result-page/device-order-ais-existing-qr-code-result-page.component';
import { DeviceOrderAisExistingOmiseSummaryPageComponent } from './containers/device-order-ais-existing-omise-summary-page/device-order-ais-existing-omise-summary-page.component';
import { DeviceOrderAisExistingOmiseGeneratorPageComponent } from './containers/device-order-ais-existing-omise-generator-page/device-order-ais-existing-omise-generator-page.component';
import { DeviceOrderAisExistingOmiseQueuePageComponent } from './containers/device-order-ais-existing-omise-queue-page/device-order-ais-existing-omise-queue-page.component';
import { DeviceOrderAisExistingOmiseResultPageComponent } from './containers/device-order-ais-existing-omise-result-page/device-order-ais-existing-omise-result-page.component';
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
    path: 'non-package',
    component: DeviceOrderAisExistingNonPackagePageComponent
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
    path: 'mobile-care-available',
    component: DeviceOrderAisExistingMobileCareAvailablePageComponent
  },
  {
    path: 'summary',
    component: DeviceOrderAisExistingSummaryPageComponent
  },
  {
    path: 'econtract',
    component: DeviceOrderAisExistingEcontractPageComponent
  },
  {
    path: 'agreement-sign',
    component: DeviceOrderAisExistingAgreementSignPageComponent
  },
  {
    path: 'queue',
    component: DeviceOrderAisExistingQueuePageComponent
  },
  {
    path: 'result',
    component: DeviceOrderAisExistingResultPageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOrderAisExistingQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-generator',
    component: DeviceOrderAisExistingQrCodeGeneratorPageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOrderAisExistingQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-result',
    component: DeviceOrderAisExistingQrCodeResultPageComponent
  },
  {
    path: 'one-love',
    component: DeviceOrderAisExistingOneLovePageComponent
  },
  {
    path: 'merge-billing',
    component: DeviceOrderAisExistingMergeBillingPageComponent
  },
  {
    path: 'aggregate',
    component: DeviceOrderAisExistingAggregatePageComponent
  },
  {
    path: 'select-package-ontop',
    component: DeviceOrderAisExistingSelectPackageOntopPageComponent
  },
  {
    path: 'omise-summary',
    component: DeviceOrderAisExistingOmiseSummaryPageComponent
  },
  {
    path: 'omise-generator',
    component: DeviceOrderAisExistingOmiseGeneratorPageComponent
  },
  {
    path: 'omise-queue',
    component: DeviceOrderAisExistingOmiseQueuePageComponent
  },
  {
    path: 'omise-result',
    component: DeviceOrderAisExistingOmiseResultPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingRoutingModule { }
