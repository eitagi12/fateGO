import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent } from './containers/device-order-ais-new-register-validate-customer-key-in-page/device-order-ais-new-register-validate-customer-key-in-page.component';
import { DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent } from './containers/device-order-ais-new-register-validate-customer-id-card-page/device-order-ais-new-register-validate-customer-id-card-page.component';
import { DeviceOrderAisNewRegisterPaymentDetailPageComponent } from './containers/device-order-ais-new-register-payment-detail-page/device-order-ais-new-register-payment-detail-page.component';
import { DeviceOrderAisNewRegisterCustomerInfoPageComponent } from './containers/device-order-ais-new-register-customer-info-page/device-order-ais-new-register-customer-info-page.component';
import { DeviceOrderAisNewRegisterSelectNumberPageComponent } from './containers/device-order-ais-new-register-select-number-page/device-order-ais-new-register-select-number-page.component';
import { DeviceOrderAisNewRegisterVerifyInstantSimPageComponent } from './containers/device-order-ais-new-register-verify-instant-sim-page/device-order-ais-new-register-verify-instant-sim-page.component';
import { DeviceOrderAisNewRegisterSelectPackagePageComponent } from './containers/device-order-ais-new-register-select-package-page/device-order-ais-new-register-select-package-page.component';
import { DeviceOrderAisNewRegisterByPatternPageComponent } from './containers/device-order-ais-new-register-by-pattern-page/device-order-ais-new-register-by-pattern-page.component';
import { DeviceOrderAisNewRegisterConfirmUserInformationPageComponent } from './containers/device-order-ais-new-register-confirm-user-information-page/device-order-ais-new-register-confirm-user-information-page.component';
import { DeviceOrderAisNewRegisterEbillingAddressPageComponent } from './containers/device-order-ais-new-register-ebilling-address-page/device-order-ais-new-register-ebilling-address-page.component';
import { DeviceOrderAisNewRegisterMobileCarePageComponent } from './containers/device-order-ais-new-register-mobile-care-page/device-order-ais-new-register-mobile-care-page.component';
import { DeviceOrderAisNewRegisterSummaryPageComponent } from './containers/device-order-ais-new-register-summary-page/device-order-ais-new-register-summary-page.component';
import { DeviceOrderAisNewRegisterAgreementPageComponent } from './containers/device-order-ais-new-register-agreement-page/device-order-ais-new-register-agreement-page.component';
import { DeviceOrderAisNewRegisterEcontactPageComponent } from './containers/device-order-ais-new-register-econtact-page/device-order-ais-new-register-econtact-page.component';
import { DeviceOrderAisNewRegisterEapplicationPageComponent } from './containers/device-order-ais-new-register-eapplication-page/device-order-ais-new-register-eapplication-page.component';
import { DeviceOrderAisNewRegisterAgreementSignPageComponent } from './containers/device-order-ais-new-register-agreement-sign-page/device-order-ais-new-register-agreement-sign-page.component';
import { DeviceOrderAisNewRegisterPersoSimPageComponent } from './containers/device-order-ais-new-register-perso-sim-page/device-order-ais-new-register-perso-sim-page.component';
import { DeviceOrderAisNewRegisterFaceCapturePageComponent } from './containers/device-order-ais-new-register-face-capture-page/device-order-ais-new-register-face-capture-page.component';
import { DeviceOrderAisNewRegisterFaceComparePageComponent } from './containers/device-order-ais-new-register-face-compare-page/device-order-ais-new-register-face-compare-page.component';
import { DeviceOrderAisNewRegisterFaceConfirmPageComponent } from './containers/device-order-ais-new-register-face-confirm-page/device-order-ais-new-register-face-confirm-page.component';
import { DeviceOrderAisNewRegisterAggregatePageComponent } from './containers/device-order-ais-new-register-aggregate-page/device-order-ais-new-register-aggregate-page.component';
import { DeviceOrderAisNewRegisterQueuePageComponent } from './containers/device-order-ais-new-register-queue-page/device-order-ais-new-register-queue-page.component';
import { DeviceOrderAisNewRegisterResultPageComponent } from './containers/device-order-ais-new-register-result-page/device-order-ais-new-register-result-page.component';
import { DeviceOrderAisNewRegisterQrCodeSummaryPageComponent } from './containers/device-order-ais-new-register-qr-code-summary-page/device-order-ais-new-register-qr-code-summary-page.component';
import { DeviceOrderAisNewRegisterQrCodeQueuePageComponent } from './containers/device-order-ais-new-register-qr-code-queue-page/device-order-ais-new-register-qr-code-queue-page.component';
import { DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent } from './containers/device-order-ais-new-register-qr-code-generator-page/device-order-ais-new-register-qr-code-generator-page.component';
import { DeviceOrderAisNewRegisterEbillingPageComponent } from './containers/device-order-ais-new-register-ebilling-page/device-order-ais-new-register-ebilling-page.component';
import { DeviceOrderAisNewRegisterQrCodeResultPageComponent } from './containers/device-order-ais-new-register-qr-code-result-page/device-order-ais-new-register-qr-code-result-page.component';
import { DeviceOrderAisNewRegisterOmiseSummaryPageComponent } from './containers/device-order-ais-new-register-omise-summary-page/device-order-ais-new-register-omise-summary-page.component';
import { DeviceOrderAisNewRegisterOmiseGeneratorPageComponent } from './containers/device-order-ais-new-register-omise-generator-page/device-order-ais-new-register-omise-generator-page.component';
import { DeviceOrderAisNewRegisterOmiseQueuePageComponent } from './containers/device-order-ais-new-register-omise-queue-page/device-order-ais-new-register-omise-queue-page.component';
import { DeviceOrderAisNewRegisterOmiseResultPageComponent } from './containers/device-order-ais-new-register-omise-result-page/device-order-ais-new-register-omise-result-page.component';

const routes: Routes = [
  {
    path: 'validate-customer-key-in',
    component: DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent
  },
  {
    path: 'validate-customer-id-card',
    component: DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent
  },
  {
    path: 'payment-detail',
    component: DeviceOrderAisNewRegisterPaymentDetailPageComponent
  },
  {
    path: 'customer-info',
    component: DeviceOrderAisNewRegisterCustomerInfoPageComponent
  },
  {
    path: 'select-number',
    component: DeviceOrderAisNewRegisterSelectNumberPageComponent
  },
  {
    path: 'verify-instant-sim',
    component: DeviceOrderAisNewRegisterVerifyInstantSimPageComponent
  },
  {
    path: 'by-pattern',
    component: DeviceOrderAisNewRegisterByPatternPageComponent
  },
  {
    path: 'select-package',
    component: DeviceOrderAisNewRegisterSelectPackagePageComponent
  },
  {
    path: 'confirm-user-information',
    component: DeviceOrderAisNewRegisterConfirmUserInformationPageComponent
  },
  {
    path: 'ebilling-address',
    component: DeviceOrderAisNewRegisterEbillingAddressPageComponent
  },
  {
    path: 'ebilling',
    component: DeviceOrderAisNewRegisterEbillingPageComponent
  },
  {
    path: 'mobile-care',
    component: DeviceOrderAisNewRegisterMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOrderAisNewRegisterSummaryPageComponent
  },
  {
    path: 'agreement',
    component: DeviceOrderAisNewRegisterAgreementPageComponent
  },
  {
    path: 'econtact',
    component: DeviceOrderAisNewRegisterEcontactPageComponent
  },
  {
    path: 'eapplication',
    component: DeviceOrderAisNewRegisterEapplicationPageComponent
  },
  {
    path: 'agreement-sign',
    component: DeviceOrderAisNewRegisterAgreementSignPageComponent
  },
  {
    path: 'perso-sim',
    component: DeviceOrderAisNewRegisterPersoSimPageComponent
  },
  {
    path: 'face-capture',
    component: DeviceOrderAisNewRegisterFaceCapturePageComponent
  },
  {
    path: 'face-compare',
    component: DeviceOrderAisNewRegisterFaceComparePageComponent
  },
  {
    path: 'face-confirm',
    component: DeviceOrderAisNewRegisterFaceConfirmPageComponent
  },
  {
    path: 'aggregate',
    component: DeviceOrderAisNewRegisterAggregatePageComponent
  },
  {
    path: 'queue',
    component: DeviceOrderAisNewRegisterQueuePageComponent
  },
  {
    path: 'result',
    component: DeviceOrderAisNewRegisterResultPageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOrderAisNewRegisterQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOrderAisNewRegisterQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-generator',
    component: DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent
  },
  {
    path: 'qr-code-result',
    component: DeviceOrderAisNewRegisterQrCodeResultPageComponent
  },
  {
    path: 'omise-summary',
    component: DeviceOrderAisNewRegisterOmiseSummaryPageComponent
  },
  {
    path: 'omise-generator',
    component: DeviceOrderAisNewRegisterOmiseGeneratorPageComponent
  },
  {
    path: 'omise-queue',
    component: DeviceOrderAisNewRegisterOmiseQueuePageComponent
  },
  {
    path: 'omise-result',
    component: DeviceOrderAisNewRegisterOmiseResultPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisNewRegisterRoutingModule { }
