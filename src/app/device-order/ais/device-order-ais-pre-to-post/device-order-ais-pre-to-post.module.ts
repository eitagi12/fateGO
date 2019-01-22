import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

import { DeviceOrderAisPreToPostRoutingModule } from './device-order-ais-pre-to-post-routing.module';
import { DeviceOrderAisPreToPostAggregatePageComponent } from './containers/device-order-ais-pre-to-post-aggregate-page/device-order-ais-pre-to-post-aggregate-page.component';
import { DeviceOrderAisPreToPostAgreementSignPageComponent } from './containers/device-order-ais-pre-to-post-agreement-sign-page/device-order-ais-pre-to-post-agreement-sign-page.component';
import { DeviceOrderAisPreToPostConfirmUserInformationPageComponent } from './containers/device-order-ais-pre-to-post-confirm-user-information-page/device-order-ais-pre-to-post-confirm-user-information-page.component';
import { DeviceOrderAisPreToPostCurrentInfoPageComponent } from './containers/device-order-ais-pre-to-post-current-info-page/device-order-ais-pre-to-post-current-info-page.component';
import { DeviceOrderAisPreToPostCustomerInfoPageComponent } from './containers/device-order-ais-pre-to-post-customer-info-page/device-order-ais-pre-to-post-customer-info-page.component';
import { DeviceOrderAisPreToPostCustomerProfilePageComponent } from './containers/device-order-ais-pre-to-post-customer-profile-page/device-order-ais-pre-to-post-customer-profile-page.component';
import { DeviceOrderAisPreToPostEapplicationPageComponent } from './containers/device-order-ais-pre-to-post-eapplication-page/device-order-ais-pre-to-post-eapplication-page.component';
import { DeviceOrderAisPreToPostEbillingAddressPageComponent } from './containers/device-order-ais-pre-to-post-ebilling-address-page/device-order-ais-pre-to-post-ebilling-address-page.component';
import { DeviceOrderAisPreToPostEbillingPageComponent } from './containers/device-order-ais-pre-to-post-ebilling-page/device-order-ais-pre-to-post-ebilling-page.component';
import { DeviceOrderAisPreToPostEligibleMobilePageComponent } from './containers/device-order-ais-pre-to-post-eligible-mobile-page/device-order-ais-pre-to-post-eligible-mobile-page.component';
import { DeviceOrderAisPreToPostIdCardCapturePageComponent } from './containers/device-order-ais-pre-to-post-id-card-capture-page/device-order-ais-pre-to-post-id-card-capture-page.component';
import { DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent } from './containers/device-order-ais-pre-to-post-id-card-capture-repi-page/device-order-ais-pre-to-post-id-card-capture-repi-page.component';
import { DeviceOrderAisPreToPostMergeBillingPageComponent } from './containers/device-order-ais-pre-to-post-merge-billing-page/device-order-ais-pre-to-post-merge-billing-page.component';
import { DeviceOrderAisPreToPostOnTopPageComponent } from './containers/device-order-ais-pre-to-post-on-top-page/device-order-ais-pre-to-post-on-top-page.component';
import { DeviceOrderAisPreToPostOneLoveComponent } from './containers/device-order-ais-pre-to-post-one-love/device-order-ais-pre-to-post-one-love.component';
import { DeviceOrderAisPreToPostOtpPageComponent } from './containers/device-order-ais-pre-to-post-otp-page/device-order-ais-pre-to-post-otp-page.component';
import { DeviceOrderAisPreToPostPaymentDetailPageComponent } from './containers/device-order-ais-pre-to-post-payment-detail-page/device-order-ais-pre-to-post-payment-detail-page.component';
import { DeviceOrderAisPreToPostResultPageComponent } from './containers/device-order-ais-pre-to-post-result-page/device-order-ais-pre-to-post-result-page.component';
import { DeviceOrderAisPreToPostSelectPackagePageComponent } from './containers/device-order-ais-pre-to-post-select-package-page/device-order-ais-pre-to-post-select-package-page.component';
import { DeviceOrderAisPreToPostSummaryPageComponent } from './containers/device-order-ais-pre-to-post-summary-page/device-order-ais-pre-to-post-summary-page.component';
import { DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-id-card-page/device-order-ais-pre-to-post-validate-customer-id-card-page.component';
import { DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-id-card-repi-page/device-order-ais-pre-to-post-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisPreToPostValidateCustomerPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-page/device-order-ais-pre-to-post-validate-customer-page.component';
import { DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent } from './containers/device-order-ais-prt-to-post-validate-customer-repi-page/device-order-ais-prt-to-post-validate-customer-repi-page.component';
import { DeviceOrderAisPreToPostMobileCarePageComponent } from './containers/device-order-ais-pre-to-post-mobile-care-page/device-order-ais-pre-to-post-mobile-care-page.component';
import { DeviceOrderAisPreToPostAgreementPageComponent } from './containers/device-order-ais-pre-to-post-agreement-page/device-order-ais-pre-to-post-agreement-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisPreToPostRoutingModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DeviceOrderAisPreToPostAggregatePageComponent,
    DeviceOrderAisPreToPostAgreementSignPageComponent,
    DeviceOrderAisPreToPostConfirmUserInformationPageComponent,
    DeviceOrderAisPreToPostCurrentInfoPageComponent,
    DeviceOrderAisPreToPostCustomerInfoPageComponent,
    DeviceOrderAisPreToPostCustomerProfilePageComponent,
    DeviceOrderAisPreToPostEapplicationPageComponent,
    DeviceOrderAisPreToPostEbillingAddressPageComponent,
    DeviceOrderAisPreToPostEbillingPageComponent,
    DeviceOrderAisPreToPostEligibleMobilePageComponent,
    DeviceOrderAisPreToPostIdCardCapturePageComponent,
    DeviceOrderAisPreToPostIdCardCaptureRepiPageComponent,
    DeviceOrderAisPreToPostMergeBillingPageComponent,
    DeviceOrderAisPreToPostOnTopPageComponent,
    DeviceOrderAisPreToPostOneLoveComponent,
    DeviceOrderAisPreToPostOtpPageComponent,
    DeviceOrderAisPreToPostPaymentDetailPageComponent,
    DeviceOrderAisPreToPostResultPageComponent,
    DeviceOrderAisPreToPostSelectPackagePageComponent,
    DeviceOrderAisPreToPostSummaryPageComponent,
    DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent,
    DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent,
    DeviceOrderAisPreToPostValidateCustomerPageComponent,
    DeviceOrderAisPrtToPostValidateCustomerRepiPageComponent,
    DeviceOrderAisPreToPostMobileCarePageComponent,
    DeviceOrderAisPreToPostAgreementPageComponent
  ]
})
export class DeviceOrderAisPreToPostModule { }
