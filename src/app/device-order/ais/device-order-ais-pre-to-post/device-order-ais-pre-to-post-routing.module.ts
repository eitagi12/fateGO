import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisPreToPostValidateCustomerPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-page/device-order-ais-pre-to-post-validate-customer-page.component';
import { DeviceOrderAisPreToPostValidateCustomerRepiPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-repi-page/device-order-ais-pre-to-post-validate-customer-repi-page.component';
import { DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-id-card-page/device-order-ais-pre-to-post-validate-customer-id-card-page.component';
import { DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-id-card-repi-page/device-order-ais-pre-to-post-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisPreToPostEligibleMobilePageComponent } from './containers/device-order-ais-pre-to-post-eligible-mobile-page/device-order-ais-pre-to-post-eligible-mobile-page.component';
import { DeviceOrderAisPreToPostPaymentDetailPageComponent } from './containers/device-order-ais-pre-to-post-payment-detail-page/device-order-ais-pre-to-post-payment-detail-page.component';
import { DeviceOrderAisPreToPostCurrentInfoPageComponent } from './containers/device-order-ais-pre-to-post-current-info-page/device-order-ais-pre-to-post-current-info-page.component';
import { DeviceOrderAisPreToPostCustomerInfoPageComponent } from './containers/device-order-ais-pre-to-post-customer-info-page/device-order-ais-pre-to-post-customer-info-page.component';
import { DeviceOrderAisPreToPostSelectPackagePageComponent } from './containers/device-order-ais-pre-to-post-select-package-page/device-order-ais-pre-to-post-select-package-page.component';
import { DeviceOrderAisPreToPostOneLoveComponent } from './containers/device-order-ais-pre-to-post-one-love/device-order-ais-pre-to-post-one-love.component';
import { DeviceOrderAisPreToPostOnTopPageComponent } from './containers/device-order-ais-pre-to-post-on-top-page/device-order-ais-pre-to-post-on-top-page.component';
import { DeviceOrderAisPreToPostMergeBillingPageComponent } from './containers/device-order-ais-pre-to-post-merge-billing-page/device-order-ais-pre-to-post-merge-billing-page.component';
import { DeviceOrderAisPreToPostConfirmUserInformationPageComponent } from './containers/device-order-ais-pre-to-post-confirm-user-information-page/device-order-ais-pre-to-post-confirm-user-information-page.component';
import { DeviceOrderAisPreToPostMobileCarePageComponent } from './containers/device-order-ais-pre-to-post-mobile-care-page/device-order-ais-pre-to-post-mobile-care-page.component';
import { DeviceOrderAisPreToPostEbillingAddressPageComponent } from './containers/device-order-ais-pre-to-post-ebilling-address-page/device-order-ais-pre-to-post-ebilling-address-page.component';
import { DeviceOrderAisPreToPostSummaryPageComponent } from './containers/device-order-ais-pre-to-post-summary-page/device-order-ais-pre-to-post-summary-page.component';
import { DeviceOrderAisPreToPostAgreementSignPageComponent } from './containers/device-order-ais-pre-to-post-agreement-sign-page/device-order-ais-pre-to-post-agreement-sign-page.component';
import { DeviceOrderAisPreToPostAggregatePageComponent } from './containers/device-order-ais-pre-to-post-aggregate-page/device-order-ais-pre-to-post-aggregate-page.component';
import { DeviceOrderAisPreToPostResultPageComponent } from './containers/device-order-ais-pre-to-post-result-page/device-order-ais-pre-to-post-result-page.component';
import { DeviceOrderAisPreToPostOtpPageComponent } from './containers/device-order-ais-pre-to-post-otp-page/device-order-ais-pre-to-post-otp-page.component';
import { DeviceOrderAisPreToPostEbillingPageComponent } from './containers/device-order-ais-pre-to-post-ebilling-page/device-order-ais-pre-to-post-ebilling-page.component';
import { DeviceOrderAisPreToPostEapplicationPageComponent } from './containers/device-order-ais-pre-to-post-eapplication-page/device-order-ais-pre-to-post-eapplication-page.component';
import { DeviceOrderAisPreToPostEcontractPageComponent } from './containers/device-order-ais-pre-to-post-econtract-page/device-order-ais-pre-to-post-econtract-page.component';
import { DeviceOrderAisPreToPostQueuePageComponent } from './containers/device-order-ais-pre-to-post-queue-page/device-order-ais-pre-to-post-queue-page.component';
import { DeviceOrderAisPreToPostCustomerProfilePageComponent } from './containers/device-order-ais-pre-to-post-customer-profile-page/device-order-ais-pre-to-post-customer-profile-page.component';
import { DeviceOrderAisPreToPostQrCodeSummaryPageComponent } from './containers/device-order-ais-pre-to-post-qr-code-summary-page/device-order-ais-pre-to-post-qr-code-summary-page.component';
import { DeviceOrderAisPreToPostQrCodeQueuePageComponent } from './containers/device-order-ais-pre-to-post-qr-code-queue-page/device-order-ais-pre-to-post-qr-code-queue-page.component';
import { DeviceOrderAisPreToPostQrCodeGeneratorPageComponent } from './containers/device-order-ais-pre-to-post-qr-code-generator-page/device-order-ais-pre-to-post-qr-code-generator-page.component';
import { DeviceOrderAisPreToPostQrCodeErrorPageComponent } from './containers/device-order-ais-pre-to-post-qr-code-error-page/device-order-ais-pre-to-post-qr-code-error-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
  { path: 'validate-customer', component: DeviceOrderAisPreToPostValidateCustomerPageComponent },
  { path: 'validate-customer-repi', component: DeviceOrderAisPreToPostValidateCustomerRepiPageComponent },
  { path: 'validate-customer-id-card', component: DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent },
  { path: 'validate-customer-id-card-repi', component: DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent },
  { path: 'eligible-mobile', component: DeviceOrderAisPreToPostEligibleMobilePageComponent },
  { path: 'payment-detail', component: DeviceOrderAisPreToPostPaymentDetailPageComponent },
  { path: 'current-info', component: DeviceOrderAisPreToPostCurrentInfoPageComponent },
  { path: 'customer-info', component: DeviceOrderAisPreToPostCustomerInfoPageComponent },
  { path: 'customer-profile', component: DeviceOrderAisPreToPostCustomerProfilePageComponent },
  { path: 'select-package', component: DeviceOrderAisPreToPostSelectPackagePageComponent },
  { path: 'one-love', component: DeviceOrderAisPreToPostOneLoveComponent },
  { path: 'on-top', component: DeviceOrderAisPreToPostOnTopPageComponent },
  { path: 'merge-billing', component: DeviceOrderAisPreToPostMergeBillingPageComponent },
  { path: 'confirm-user-information', component: DeviceOrderAisPreToPostConfirmUserInformationPageComponent },
  { path: 'mobile-care', component: DeviceOrderAisPreToPostMobileCarePageComponent },
  { path: 'ebilling-address', component: DeviceOrderAisPreToPostEbillingAddressPageComponent },
  { path: 'summary', component: DeviceOrderAisPreToPostSummaryPageComponent },
  { path: 'agreement-sign', component: DeviceOrderAisPreToPostAgreementSignPageComponent },
  { path: 'aggregate', component: DeviceOrderAisPreToPostAggregatePageComponent },
  { path: 'result', component: DeviceOrderAisPreToPostResultPageComponent },
  { path: 'otp', component: DeviceOrderAisPreToPostOtpPageComponent },
  { path: 'ebilling', component: DeviceOrderAisPreToPostEbillingPageComponent },
  { path: 'eapplication', component: DeviceOrderAisPreToPostEapplicationPageComponent },
  { path: 'econtract', component: DeviceOrderAisPreToPostEcontractPageComponent },
  { path: 'queue', component: DeviceOrderAisPreToPostQueuePageComponent },
  { path: 'qr-code-summary', component: DeviceOrderAisPreToPostQrCodeSummaryPageComponent },
  { path: 'qr-code-queue', component: DeviceOrderAisPreToPostQrCodeQueuePageComponent },
  { path: 'qr-code-generator', component: DeviceOrderAisPreToPostQrCodeGeneratorPageComponent },
  { path: 'qr-code-error', component: DeviceOrderAisPreToPostQrCodeErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisPreToPostRoutingModule { }
