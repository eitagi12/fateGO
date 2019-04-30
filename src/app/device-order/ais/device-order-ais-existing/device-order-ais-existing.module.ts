import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

import { DeviceOrderAisExistingRoutingModule } from './device-order-ais-existing-routing.module';
import { DeviceOrderAisExistingValidateCustomerPageComponent } from './containers/device-order-ais-existing-validate-customer-page/device-order-ais-existing-validate-customer-page.component';
import { DeviceOrderAisExistingValidateCustomerKeyInPageComponent } from './containers/device-order-ais-existing-validate-customer-key-in-page/device-order-ais-existing-validate-customer-key-in-page.component';
import { DeviceOrderAisExistingValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-validate-customer-id-card-page/device-order-ais-existing-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingCustomerInfoPageComponent } from './containers/device-order-ais-existing-customer-info-page/device-order-ais-existing-customer-info-page.component';
import { DeviceOrderAisExistingEligibleMobilePageComponent } from './containers/device-order-ais-existing-eligible-mobile-page/device-order-ais-existing-eligible-mobile-page.component';
import { DeviceOrderAisExistingChangePackagePageComponent } from './containers/device-order-ais-existing-change-package-page/device-order-ais-existing-change-package-page.component';
import { DeviceOrderAisExistingMobileDetailPageComponent } from './containers/device-order-ais-existing-mobile-detail-page/device-order-ais-existing-mobile-detail-page.component';
import { DeviceOrderAisExistingPaymentDetailPageComponent } from './containers/device-order-ais-existing-payment-detail-page/device-order-ais-existing-payment-detail-page.component';
import { DeviceOrderAisExistingSelectPackagePageComponent } from './containers/device-order-ais-existing-select-package-page/device-order-ais-existing-select-package-page.component';
import { DeviceOrderAisExistingEffectiveStartDatePageComponent } from './containers/device-order-ais-existing-effective-start-date-page/device-order-ais-existing-effective-start-date-page.component';
import { DeviceOrderAisExistingMobileCarePageComponent } from './containers/device-order-ais-existing-mobile-care-page/device-order-ais-existing-mobile-care-page.component';
import { DeviceOrderAisExistingSummaryPageComponent } from './containers/device-order-ais-existing-summary-page/device-order-ais-existing-summary-page.component';
import { DeviceOrderAisExistingAgreementPageComponent } from './containers/device-order-ais-existing-agreement-page/device-order-ais-existing-agreement-page.component';
import { DeviceOrderAisExistingAgreementSignPageComponent } from './containers/device-order-ais-existing-agreement-sign-page/device-order-ais-existing-agreement-sign-page.component';
import { DeviceOrderAisExistingAggregatePageComponent } from './containers/device-order-ais-existing-aggregate-page/device-order-ais-existing-aggregate-page.component';
import { DeviceOrderAisExistingQueuePageComponent } from './containers/device-order-ais-existing-queue-page/device-order-ais-existing-queue-page.component';
import { DeviceOrderAisExistingResultPageComponent } from './containers/device-order-ais-existing-result-page/device-order-ais-existing-result-page.component';
import { DeviceOrderAisExistingQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-qr-code-summary-page/device-order-ais-existing-qr-code-summary-page.component';
import { DeviceOrderAisExistingQrCodeGeneratorPageComponent } from './containers/device-order-ais-existing-qr-code-generator-page/device-order-ais-existing-qr-code-generator-page.component';
import { DeviceOrderAisExistingQrCodeQueuePageComponent } from './containers/device-order-ais-existing-qr-code-queue-page/device-order-ais-existing-qr-code-queue-page.component';
import { DeviceOrderAisExistingOneLovePageComponent } from './containers/device-order-ais-existing-one-love-page/device-order-ais-existing-one-love-page.component';
import { DeviceOrderAisExistingMergeBillingPageComponent } from './containers/device-order-ais-existing-merge-billing-page/device-order-ais-existing-merge-billing-page.component';
import { DeviceOrderAisExistingEapplicationPageComponent } from './containers/device-order-ais-existing-eapplication-page/device-order-ais-existing-eapplication-page.component';
import { DeviceOrderAisExistingEbillingAddressPageComponent } from './containers/device-order-ais-existing-ebilling-address-page/device-order-ais-existing-ebilling-address-page.component';
import { DeviceOrderAisExistingMobileCareAvailablePageComponent } from './containers/device-order-ais-existing-mobile-care-available-page/device-order-ais-existing-mobile-care-available-page.component';
import { DeviceOrderAisExistingEcontractPageComponent } from './containers/device-order-ais-existing-econtract-page/device-order-ais-existing-econtract-page.component';
import { DeviceOrderAisExistingNonPackagePageComponent } from './containers/device-order-ais-existing-non-package-page/device-order-ais-existing-non-package-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    DeviceOrderAisExistingRoutingModule
  ],
  declarations: [
    DeviceOrderAisExistingValidateCustomerPageComponent,
    DeviceOrderAisExistingValidateCustomerKeyInPageComponent,
    DeviceOrderAisExistingValidateCustomerIdCardPageComponent,
    DeviceOrderAisExistingCustomerInfoPageComponent,
    DeviceOrderAisExistingEligibleMobilePageComponent,
    DeviceOrderAisExistingChangePackagePageComponent,
    DeviceOrderAisExistingMobileDetailPageComponent,
    DeviceOrderAisExistingPaymentDetailPageComponent,
    DeviceOrderAisExistingSelectPackagePageComponent,
    DeviceOrderAisExistingEffectiveStartDatePageComponent,
    DeviceOrderAisExistingMobileCarePageComponent,
    DeviceOrderAisExistingSummaryPageComponent,
    DeviceOrderAisExistingAgreementPageComponent,
    DeviceOrderAisExistingAgreementSignPageComponent,
    DeviceOrderAisExistingAggregatePageComponent,
    DeviceOrderAisExistingQueuePageComponent,
    DeviceOrderAisExistingResultPageComponent,
    DeviceOrderAisExistingQrCodeSummaryPageComponent,
    DeviceOrderAisExistingQrCodeGeneratorPageComponent,
    DeviceOrderAisExistingQrCodeQueuePageComponent,
    DeviceOrderAisExistingOneLovePageComponent,
    DeviceOrderAisExistingMergeBillingPageComponent,
    DeviceOrderAisExistingEapplicationPageComponent,
    DeviceOrderAisExistingEbillingAddressPageComponent,
    DeviceOrderAisExistingMobileCareAvailablePageComponent,
    DeviceOrderAisExistingEcontractPageComponent,
    DeviceOrderAisExistingNonPackagePageComponent
  ]
})
export class DeviceOrderAisExistingModule { }
