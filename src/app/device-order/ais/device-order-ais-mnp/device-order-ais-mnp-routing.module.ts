import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisMnpValidateCustomerPageComponent } from './containers/device-order-ais-mnp-validate-customer-page/device-order-ais-mnp-validate-customer-page.component';
import { DeviceOrderAisMnpValidateCustomerKeyInPageComponent } from './containers/device-order-ais-mnp-validate-customer-key-in-page/device-order-ais-mnp-validate-customer-key-in-page.component';
import { DeviceOrderAisMnpValidateCustomerIdCardPageComponent } from './containers/device-order-ais-mnp-validate-customer-id-card-page/device-order-ais-mnp-validate-customer-id-card-page.component';
import { DeviceOrderAisMnpPaymentDetailPageComponent } from './containers/device-order-ais-mnp-payment-detail-page/device-order-ais-mnp-payment-detail-page.component';
import { DeviceOrderAisMnpCustomerInfoPageComponent } from './containers/device-order-ais-mnp-customer-info-page/device-order-ais-mnp-customer-info-page.component';
import { DeviceOrderAisMnpSelectNumberPageComponent } from './containers/device-order-ais-mnp-select-number-page/device-order-ais-mnp-select-number-page.component';
import { DeviceOrderAisMnpVerifyInstantSimPageComponent } from './containers/device-order-ais-mnp-verify-instant-sim-page/device-order-ais-mnp-verify-instant-sim-page.component';
import { DeviceOrderAisMnpByPatternPageComponent } from './containers/device-order-ais-mnp-by-pattern-page/device-order-ais-mnp-by-pattern-page.component';
import { DeviceOrderAisMnpSelectPackagePageComponent } from './containers/device-order-ais-mnp-select-package-page/device-order-ais-mnp-select-package-page.component';
import { DeviceOrderAisMnpConfirmUserInformationPageComponent } from './containers/device-order-ais-mnp-confirm-user-information-page/device-order-ais-mnp-confirm-user-information-page.component';
import { DeviceOrderAisMnpEbillingAddressPageComponent } from './containers/device-order-ais-mnp-ebilling-address-page/device-order-ais-mnp-ebilling-address-page.component';
import { DeviceOrderAisMnpEbillingPageComponent } from './containers/device-order-ais-mnp-ebilling-page/device-order-ais-mnp-ebilling-page.component';
import { DeviceOrderAisMnpMobileCarePageComponent } from './containers/device-order-ais-mnp-mobile-care-page/device-order-ais-mnp-mobile-care-page.component';
import { DeviceOrderAisMnpSummaryPageComponent } from './containers/device-order-ais-mnp-summary-page/device-order-ais-mnp-summary-page.component';
import { DeviceOrderAisMnpEcontactPageComponent } from './containers/device-order-ais-mnp-econtact-page/device-order-ais-mnp-econtact-page.component';
import { DeviceOrderAisMnpAgreementSignPageComponent } from './containers/device-order-ais-mnp-agreement-sign-page/device-order-ais-mnp-agreement-sign-page.component';
import { DeviceOrderAisMnpFaceCapturePageComponent } from './containers/device-order-ais-mnp-face-capture-page/device-order-ais-mnp-face-capture-page.component';
import { DeviceOrderAisMnpFaceComparePageComponent } from './containers/device-order-ais-mnp-face-compare-page/device-order-ais-mnp-face-compare-page.component';
import { DeviceOrderAisMnpFaceConfirmPageComponent } from './containers/device-order-ais-mnp-face-confirm-page/device-order-ais-mnp-face-confirm-page.component';
import { DeviceOrderAisMnpAggregatePageComponent } from './containers/device-order-ais-mnp-aggregate-page/device-order-ais-mnp-aggregate-page.component';
import { DeviceOrderAisMnpQueuePageComponent } from './containers/device-order-ais-mnp-queue-page/device-order-ais-mnp-queue-page.component';
import { DeviceOrderAisMnpResultPageComponent } from './containers/device-order-ais-mnp-result-page/device-order-ais-mnp-result-page.component';
import { DeviceOrderAisMnpQrCodeSummaryPageComponent } from './containers/device-order-ais-mnp-qr-code-summary-page/device-order-ais-mnp-qr-code-summary-page.component';
import { DeviceOrderAisMnpQrCodeQueuePageComponent } from './containers/device-order-ais-mnp-qr-code-queue-page/device-order-ais-mnp-qr-code-queue-page.component';
import { DeviceOrderAisMnpQrCodeGeneratorPageComponent } from './containers/device-order-ais-mnp-qr-code-generator-page/device-order-ais-mnp-qr-code-generator-page.component';
import { DeviceOrderAisMnpEligibleMobilePageComponent } from './containers/device-order-ais-mnp-eligible-mobile-page/device-order-ais-mnp-eligible-mobile-page.component';
import { DeviceOrderAisMnpMobileDetailPageComponent } from './containers/device-order-ais-mnp-mobile-detail-page/device-order-ais-mnp-mobile-detail-page.component';
import { DeviceOrderAisMnpEffectiveStartDatePageComponent } from './containers/device-order-ais-mnp-effective-start-date-page/device-order-ais-mnp-effective-start-date-page.component';
import { DeviceOrderAisMnpMobileCareAvaliblePageComponent } from './containers/device-order-ais-mnp-mobile-care-avalible-page/device-order-ais-mnp-mobile-care-avalible-page.component';
import { DeviceOrderAisMnpQrCodeResultPageComponent } from './containers/device-order-ais-mnp-qr-code-result-page/device-order-ais-mnp-qr-code-result-page.component';
const routes: Routes = [
  { path: 'validate-customer', component: DeviceOrderAisMnpValidateCustomerPageComponent },
  { path: 'validate-customer-key-in', component: DeviceOrderAisMnpValidateCustomerKeyInPageComponent },
  { path: 'validate-customer-id-card', component: DeviceOrderAisMnpValidateCustomerIdCardPageComponent },
  { path: 'payment-detail', component: DeviceOrderAisMnpPaymentDetailPageComponent },
  { path: 'customer-info', component: DeviceOrderAisMnpCustomerInfoPageComponent },
  { path: 'select-number', component: DeviceOrderAisMnpSelectNumberPageComponent },
  { path: 'verify-instant-sim', component: DeviceOrderAisMnpVerifyInstantSimPageComponent },
  { path: 'by-pattern', component: DeviceOrderAisMnpByPatternPageComponent },
  { path: 'select-package', component: DeviceOrderAisMnpSelectPackagePageComponent },
  { path: 'confirm-user-information', component: DeviceOrderAisMnpConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: DeviceOrderAisMnpEbillingAddressPageComponent },
  { path: 'ebilling', component: DeviceOrderAisMnpEbillingPageComponent },
  { path: 'mobile-care', component: DeviceOrderAisMnpMobileCarePageComponent },
  { path: 'mobile-care-avalible', component: DeviceOrderAisMnpMobileCareAvaliblePageComponent },
  { path: 'summary', component: DeviceOrderAisMnpSummaryPageComponent },
  { path: 'econtact', component: DeviceOrderAisMnpEcontactPageComponent },
  { path: 'agreement-sign', component: DeviceOrderAisMnpAgreementSignPageComponent },
  { path: 'face-capture', component: DeviceOrderAisMnpFaceCapturePageComponent },
  { path: 'face-compare', component: DeviceOrderAisMnpFaceComparePageComponent },
  { path: 'face-confirm', component: DeviceOrderAisMnpFaceConfirmPageComponent },
  { path: 'aggregate', component: DeviceOrderAisMnpAggregatePageComponent },
  { path: 'queue', component: DeviceOrderAisMnpQueuePageComponent },
  { path: 'result', component: DeviceOrderAisMnpResultPageComponent },
  { path: 'qr-code-summary', component: DeviceOrderAisMnpQrCodeSummaryPageComponent },
  { path: 'qr-code-queue', component: DeviceOrderAisMnpQrCodeQueuePageComponent },
  { path: 'qr-code-generator', component: DeviceOrderAisMnpQrCodeGeneratorPageComponent },
  { path: 'qr-code-result', component: DeviceOrderAisMnpQrCodeResultPageComponent },
  { path: 'eligible-mobile', component: DeviceOrderAisMnpEligibleMobilePageComponent },
  { path: 'mobile-detail', component: DeviceOrderAisMnpMobileDetailPageComponent },
  { path: 'effective-start-date', component: DeviceOrderAisMnpEffectiveStartDatePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisMnpRoutingModule { }
