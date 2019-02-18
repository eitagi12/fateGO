import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPreToPostValidateCustomerPageComponent } from './containers/order-pre-to-post-validate-customer-page/order-pre-to-post-validate-customer-page.component';
import { OrderPreToPostValidateCustomerIdCardPageComponent } from './containers/order-pre-to-post-validate-customer-id-card-page/order-pre-to-post-validate-customer-id-card-page.component';
import { OrderPreToPostEligibleMobilePageComponent } from './containers/order-pre-to-post-eligible-mobile-page/order-pre-to-post-eligible-mobile-page.component';
import { OrderPreToPostCurrentInfoPageComponent } from './containers/order-pre-to-post-current-info-page/order-pre-to-post-current-info-page.component';
import { OrderPreToPostCustomerInfoPageComponent } from './containers/order-pre-to-post-customer-info-page/order-pre-to-post-customer-info-page.component';
import { OrderPreToPostIdCardCapturePageComponent } from './containers/order-pre-to-post-id-card-capture-page/order-pre-to-post-id-card-capture-page.component';
import { OrderPreToPostSelectPackagePageComponent } from './containers/order-pre-to-post-select-package-page/order-pre-to-post-select-package-page.component';
import { OrderPreToPostOnTopPageComponent } from './containers/order-pre-to-post-on-top-page/order-pre-to-post-on-top-page.component';
import { OrderPreToPostMergeBillingPageComponent } from './containers/order-pre-to-post-merge-billing-page/order-pre-to-post-merge-billing-page.component';
import { OrderPreToPostConfirmUserInformationPageComponent } from './containers/order-pre-to-post-confirm-user-information-page/order-pre-to-post-confirm-user-information-page.component';
import { OrderPreToPostSummaryPageComponent } from './containers/order-pre-to-post-summary-page/order-pre-to-post-summary-page.component';
import { OrderPreToPostAgreementSignPageComponent } from './containers/order-pre-to-post-agreement-sign-page/order-pre-to-post-agreement-sign-page.component';
import { OrderPreToPostAggregatePageComponent } from './containers/order-pre-to-post-aggregate-page/order-pre-to-post-aggregate-page.component';
import { OrderPreToPostResultPageComponent } from './containers/order-pre-to-post-result-page/order-pre-to-post-result-page.component';
import { OrderPreToPostEbillingAddressPageComponent } from './containers/order-pre-to-post-ebilling-address-page/order-pre-to-post-ebilling-address-page.component';
import { OrderPrtToPostValidateCustomerRepiPageComponent } from './containers/order-prt-to-post-validate-customer-repi-page/order-prt-to-post-validate-customer-repi-page.component';
import { OrderPreToPostValidateCustomerIdCardRepiPageComponent } from './containers/order-pre-to-post-validate-customer-id-card-repi-page/order-pre-to-post-validate-customer-id-card-repi-page.component';
import { OrderPreToPostOtpPageComponent } from './containers/order-pre-to-post-otp-page/order-pre-to-post-otp-page.component';
import { OrderPreToPostCustomerProfilePageComponent } from './containers/order-pre-to-post-customer-profile-page/order-pre-to-post-customer-profile-page.component';
import { OrderPreToPostIdCardCaptureRepiPageComponent } from './containers/order-pre-to-post-id-card-capture-repi-page/order-pre-to-post-id-card-capture-repi-page.component';
import { OrderPreToPostEbillingPageComponent } from './containers/order-pre-to-post-ebilling-page/order-pre-to-post-ebilling-page.component';
import { OrderPreToPostEapplicationPageComponent } from './containers/order-pre-to-post-eapplication-page/order-pre-to-post-eapplication-page.component';
import { OrderPreToPostOneLoveComponent } from './containers/order-pre-to-post-one-love/order-pre-to-post-one-love.component';
import { OrderPreToPostPassportInfoPageComponent } from './containers/order-pre-to-post-passport-info-page/order-pre-to-post-passport-info-page.component';
import { OrderPreToPostPassportInfoRepiPageComponent } from './containers/order-pre-to-post-passport-info-repi-page/order-pre-to-post-passport-info-repi-page.component';
import { OrderPreToPostVerifyDocumentRepiPageComponent } from './containers/order-pre-to-post-verify-document-repi-page/order-pre-to-post-verify-document-repi-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
  { path: 'validate-customer', component: OrderPreToPostValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: OrderPreToPostValidateCustomerIdCardPageComponent },
  { path: 'eligible-mobile', component: OrderPreToPostEligibleMobilePageComponent },
  { path: 'current-info', component: OrderPreToPostCurrentInfoPageComponent },
  { path: 'customer-info', component: OrderPreToPostCustomerInfoPageComponent },
  { path: 'id-card-capture', component: OrderPreToPostIdCardCapturePageComponent },
  { path: 'select-package', component: OrderPreToPostSelectPackagePageComponent },
  { path: 'one-love', component: OrderPreToPostOneLoveComponent },
  { path: 'on-top', component: OrderPreToPostOnTopPageComponent },
  { path: 'merge-billing', component: OrderPreToPostMergeBillingPageComponent },
  { path: 'confirm-user-information', component: OrderPreToPostConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: OrderPreToPostEbillingAddressPageComponent },
  { path: 'summary', component: OrderPreToPostSummaryPageComponent },
  { path: 'agreement-sign', component: OrderPreToPostAgreementSignPageComponent },
  { path: 'aggregate', component: OrderPreToPostAggregatePageComponent },
  { path: 'result', component: OrderPreToPostResultPageComponent },
  { path: 'validate-customer-repi', component: OrderPrtToPostValidateCustomerRepiPageComponent },
  { path: 'validate-customer-id-card-repi', component: OrderPreToPostValidateCustomerIdCardRepiPageComponent },
  { path: 'otp', component: OrderPreToPostOtpPageComponent },
  { path: 'customer-profile', component: OrderPreToPostCustomerProfilePageComponent },
  { path: 'id-card-capture-repi', component: OrderPreToPostIdCardCaptureRepiPageComponent },
  { path: 'ebilling', component: OrderPreToPostEbillingPageComponent },
  { path: 'eapplication', component: OrderPreToPostEapplicationPageComponent },
  { path: 'passport-info', component: OrderPreToPostPassportInfoPageComponent },
  { path: 'passport-info-repi' , component: OrderPreToPostPassportInfoRepiPageComponent },
  { path: 'verify-document-repi', component: OrderPreToPostVerifyDocumentRepiPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPreToPostRoutingModule { }
