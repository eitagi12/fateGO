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
import { DeviceOrderAisPreToPostEapplicationPageComponent } from './containers/device-order-ais-pre-to-post-eapplication-page/device-order-ais-pre-to-post-eapplication-page.component';
import { DeviceOrderAisPreToPostEbillingAddressPageComponent } from './containers/device-order-ais-pre-to-post-ebilling-address-page/device-order-ais-pre-to-post-ebilling-address-page.component';
import { DeviceOrderAisPreToPostEbillingPageComponent } from './containers/device-order-ais-pre-to-post-ebilling-page/device-order-ais-pre-to-post-ebilling-page.component';
import { DeviceOrderAisPreToPostEligibleMobilePageComponent } from './containers/device-order-ais-pre-to-post-eligible-mobile-page/device-order-ais-pre-to-post-eligible-mobile-page.component';
import { DeviceOrderAisPreToPostMergeBillingPageComponent } from './containers/device-order-ais-pre-to-post-merge-billing-page/device-order-ais-pre-to-post-merge-billing-page.component';
import { DeviceOrderAisPreToPostOnTopPageComponent } from './containers/device-order-ais-pre-to-post-on-top-page/device-order-ais-pre-to-post-on-top-page.component';
import { DeviceOrderAisPreToPostOtpPageComponent } from './containers/device-order-ais-pre-to-post-otp-page/device-order-ais-pre-to-post-otp-page.component';
import { DeviceOrderAisPreToPostPaymentDetailPageComponent } from './containers/device-order-ais-pre-to-post-payment-detail-page/device-order-ais-pre-to-post-payment-detail-page.component';
import { DeviceOrderAisPreToPostResultPageComponent } from './containers/device-order-ais-pre-to-post-result-page/device-order-ais-pre-to-post-result-page.component';
import { DeviceOrderAisPreToPostSelectPackagePageComponent } from './containers/device-order-ais-pre-to-post-select-package-page/device-order-ais-pre-to-post-select-package-page.component';
import { DeviceOrderAisPreToPostSummaryPageComponent } from './containers/device-order-ais-pre-to-post-summary-page/device-order-ais-pre-to-post-summary-page.component';
import { DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-id-card-page/device-order-ais-pre-to-post-validate-customer-id-card-page.component';
import { DeviceOrderAisPreToPostMobileCarePageComponent } from './containers/device-order-ais-pre-to-post-mobile-care-page/device-order-ais-pre-to-post-mobile-care-page.component';
import { DeviceOrderAisPreToPostEcontractPageComponent } from './containers/device-order-ais-pre-to-post-econtract-page/device-order-ais-pre-to-post-econtract-page.component';
import { DeviceOrderAisPreToPostQrCodeGeneratorPageComponent } from './containers/device-order-ais-pre-to-post-qr-code-generator-page/device-order-ais-pre-to-post-qr-code-generator-page.component';
import { DeviceOrderAisPreToPostQrCodeQueuePageComponent } from './containers/device-order-ais-pre-to-post-qr-code-queue-page/device-order-ais-pre-to-post-qr-code-queue-page.component';
import { DeviceOrderAisPreToPostQrCodeSummaryPageComponent } from './containers/device-order-ais-pre-to-post-qr-code-summary-page/device-order-ais-pre-to-post-qr-code-summary-page.component';
import { DeviceOrderAisPreToPostQueuePageComponent } from './containers/device-order-ais-pre-to-post-queue-page/device-order-ais-pre-to-post-queue-page.component';
import { DeviceOrderAisPreToPostValidateCustomerPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-page/device-order-ais-pre-to-post-validate-customer-page.component';
import { DeviceOrderAisPreToPostValidateCustomerRepiPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-repi-page/device-order-ais-pre-to-post-validate-customer-repi-page.component';
import { DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent } from './containers/device-order-ais-pre-to-post-validate-customer-id-card-repi-page/device-order-ais-pre-to-post-validate-customer-id-card-repi-page.component';
import { DeviceOrderAisPreToPostCustomerProfilePageComponent } from './containers/device-order-ais-pre-to-post-customer-profile-page/device-order-ais-pre-to-post-customer-profile-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOrderAisPreToPostQrCodeResultPageComponent } from './containers/device-order-ais-pre-to-post-qr-code-result-page/device-order-ais-pre-to-post-qr-code-result-page.component';
import { DeviceOrderAisPreToPostOmiseSummaryPageComponent } from './containers/device-order-ais-pre-to-post-omise-summary-page/device-order-ais-pre-to-post-omise-summary-page.component';
import { DeviceOrderAisPreToPostOmiseGeneratorPageComponent } from './containers/device-order-ais-pre-to-post-omise-generator-page/device-order-ais-pre-to-post-omise-generator-page.component';
import { DeviceOrderAisPreToPostOmiseQueuePageComponent } from './containers/device-order-ais-pre-to-post-omise-queue-page/device-order-ais-pre-to-post-omise-queue-page.component';
import { DeviceOrderAisPreToPostOmiseResultPageComponent } from './containers/device-order-ais-pre-to-post-omise-result-page/device-order-ais-pre-to-post-omise-result-page.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    DeviceOrderAisPreToPostRoutingModule,
    TranslateModule
  ],
  declarations: [
    DeviceOrderAisPreToPostValidateCustomerPageComponent,
    DeviceOrderAisPreToPostValidateCustomerRepiPageComponent,
    DeviceOrderAisPreToPostValidateCustomerIdCardPageComponent,
    DeviceOrderAisPreToPostValidateCustomerIdCardRepiPageComponent,
    DeviceOrderAisPreToPostAggregatePageComponent,
    DeviceOrderAisPreToPostAgreementSignPageComponent,
    DeviceOrderAisPreToPostConfirmUserInformationPageComponent,
    DeviceOrderAisPreToPostCurrentInfoPageComponent,
    DeviceOrderAisPreToPostCustomerInfoPageComponent,
    DeviceOrderAisPreToPostEapplicationPageComponent,
    DeviceOrderAisPreToPostEbillingAddressPageComponent,
    DeviceOrderAisPreToPostEbillingPageComponent,
    DeviceOrderAisPreToPostEligibleMobilePageComponent,
    DeviceOrderAisPreToPostMergeBillingPageComponent,
    DeviceOrderAisPreToPostOnTopPageComponent,
    DeviceOrderAisPreToPostOtpPageComponent,
    DeviceOrderAisPreToPostPaymentDetailPageComponent,
    DeviceOrderAisPreToPostResultPageComponent,
    DeviceOrderAisPreToPostSelectPackagePageComponent,
    DeviceOrderAisPreToPostSummaryPageComponent,
    DeviceOrderAisPreToPostMobileCarePageComponent,
    DeviceOrderAisPreToPostEcontractPageComponent,
    DeviceOrderAisPreToPostQrCodeGeneratorPageComponent,
    DeviceOrderAisPreToPostQrCodeQueuePageComponent,
    DeviceOrderAisPreToPostQrCodeSummaryPageComponent,
    DeviceOrderAisPreToPostQueuePageComponent,
    DeviceOrderAisPreToPostCustomerProfilePageComponent,
    DeviceOrderAisPreToPostQrCodeGeneratorPageComponent,
    DeviceOrderAisPreToPostQrCodeSummaryPageComponent,
    DeviceOrderAisPreToPostQrCodeQueuePageComponent,
    DeviceOrderAisPreToPostQrCodeResultPageComponent,
    DeviceOrderAisPreToPostOmiseSummaryPageComponent,
    DeviceOrderAisPreToPostOmiseGeneratorPageComponent,
    DeviceOrderAisPreToPostOmiseQueuePageComponent,
    DeviceOrderAisPreToPostOmiseResultPageComponent
  ]
})
export class DeviceOrderAisPreToPostModule { }
