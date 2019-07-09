import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisMnpRoutingModule } from './device-order-ais-mnp-routing.module';
import { DeviceOrderAisMnpAggregatePageComponent } from './containers/device-order-ais-mnp-aggregate-page/device-order-ais-mnp-aggregate-page.component';
import { DeviceOrderAisMnpAgreementSignPageComponent } from './containers/device-order-ais-mnp-agreement-sign-page/device-order-ais-mnp-agreement-sign-page.component';
import { DeviceOrderAisMnpConfirmUserInformationPageComponent } from './containers/device-order-ais-mnp-confirm-user-information-page/device-order-ais-mnp-confirm-user-information-page.component';
import { DeviceOrderAisMnpCustomerInfoPageComponent } from './containers/device-order-ais-mnp-customer-info-page/device-order-ais-mnp-customer-info-page.component';
import { DeviceOrderAisMnpEbillingAddressPageComponent } from './containers/device-order-ais-mnp-ebilling-address-page/device-order-ais-mnp-ebilling-address-page.component';
import { DeviceOrderAisMnpEbillingPageComponent } from './containers/device-order-ais-mnp-ebilling-page/device-order-ais-mnp-ebilling-page.component';
import { DeviceOrderAisMnpEcontactPageComponent } from './containers/device-order-ais-mnp-econtact-page/device-order-ais-mnp-econtact-page.component';
import { DeviceOrderAisMnpFaceCapturePageComponent } from './containers/device-order-ais-mnp-face-capture-page/device-order-ais-mnp-face-capture-page.component';
import { DeviceOrderAisMnpFaceComparePageComponent } from './containers/device-order-ais-mnp-face-compare-page/device-order-ais-mnp-face-compare-page.component';
import { DeviceOrderAisMnpFaceConfirmPageComponent } from './containers/device-order-ais-mnp-face-confirm-page/device-order-ais-mnp-face-confirm-page.component';
import { DeviceOrderAisMnpMobileCarePageComponent } from './containers/device-order-ais-mnp-mobile-care-page/device-order-ais-mnp-mobile-care-page.component';
import { DeviceOrderAisMnpPaymentDetailPageComponent } from './containers/device-order-ais-mnp-payment-detail-page/device-order-ais-mnp-payment-detail-page.component';
import { DeviceOrderAisMnpQrCodeGeneratorPageComponent } from './containers/device-order-ais-mnp-qr-code-generator-page/device-order-ais-mnp-qr-code-generator-page.component';
import { DeviceOrderAisMnpQrCodeQueuePageComponent } from './containers/device-order-ais-mnp-qr-code-queue-page/device-order-ais-mnp-qr-code-queue-page.component';
import { DeviceOrderAisMnpQrCodeSummaryPageComponent } from './containers/device-order-ais-mnp-qr-code-summary-page/device-order-ais-mnp-qr-code-summary-page.component';
import { DeviceOrderAisMnpQueuePageComponent } from './containers/device-order-ais-mnp-queue-page/device-order-ais-mnp-queue-page.component';
import { DeviceOrderAisMnpResultPageComponent } from './containers/device-order-ais-mnp-result-page/device-order-ais-mnp-result-page.component';
import { DeviceOrderAisMnpSelectPackagePageComponent } from './containers/device-order-ais-mnp-select-package-page/device-order-ais-mnp-select-package-page.component';
import { DeviceOrderAisMnpSummaryPageComponent } from './containers/device-order-ais-mnp-summary-page/device-order-ais-mnp-summary-page.component';
import { DeviceOrderAisMnpValidateCustomerIdCardPageComponent } from './containers/device-order-ais-mnp-validate-customer-id-card-page/device-order-ais-mnp-validate-customer-id-card-page.component';
import { DeviceOrderAisMnpValidateCustomerKeyInPageComponent } from './containers/device-order-ais-mnp-validate-customer-key-in-page/device-order-ais-mnp-validate-customer-key-in-page.component';
import { DeviceOrderAisMnpValidateCustomerPageComponent } from './containers/device-order-ais-mnp-validate-customer-page/device-order-ais-mnp-validate-customer-page.component';
import { DeviceOrderAisMnpEligibleMobilePageComponent } from './containers/device-order-ais-mnp-eligible-mobile-page/device-order-ais-mnp-eligible-mobile-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOrderAisMnpMobileDetailPageComponent } from './containers/device-order-ais-mnp-mobile-detail-page/device-order-ais-mnp-mobile-detail-page.component';
import { DeviceOrderAisMnpEffectiveStartDatePageComponent } from './containers/device-order-ais-mnp-effective-start-date-page/device-order-ais-mnp-effective-start-date-page.component';
import { DeviceOrderAisMnpMobileCareAvaliblePageComponent } from './containers/device-order-ais-mnp-mobile-care-avalible-page/device-order-ais-mnp-mobile-care-avalible-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOrderAisMnpQrCodeResultPageComponent } from './containers/device-order-ais-mnp-qr-code-result-page/device-order-ais-mnp-qr-code-result-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    DeviceOrderAisMnpRoutingModule,
    TranslateModule
  ],
  declarations: [
    DeviceOrderAisMnpAggregatePageComponent,
    DeviceOrderAisMnpAgreementSignPageComponent,
    DeviceOrderAisMnpConfirmUserInformationPageComponent,
    DeviceOrderAisMnpCustomerInfoPageComponent,
    DeviceOrderAisMnpEbillingAddressPageComponent,
    DeviceOrderAisMnpEbillingPageComponent,
    DeviceOrderAisMnpEcontactPageComponent,
    DeviceOrderAisMnpFaceCapturePageComponent,
    DeviceOrderAisMnpFaceComparePageComponent,
    DeviceOrderAisMnpFaceConfirmPageComponent,
    DeviceOrderAisMnpMobileCarePageComponent,
    DeviceOrderAisMnpPaymentDetailPageComponent,
    DeviceOrderAisMnpQrCodeGeneratorPageComponent,
    DeviceOrderAisMnpQrCodeQueuePageComponent,
    DeviceOrderAisMnpQrCodeSummaryPageComponent,
    DeviceOrderAisMnpQueuePageComponent,
    DeviceOrderAisMnpResultPageComponent,
    DeviceOrderAisMnpSelectPackagePageComponent,
    DeviceOrderAisMnpSummaryPageComponent,
    DeviceOrderAisMnpValidateCustomerIdCardPageComponent,
    DeviceOrderAisMnpValidateCustomerKeyInPageComponent,
    DeviceOrderAisMnpValidateCustomerPageComponent,
    DeviceOrderAisMnpEligibleMobilePageComponent,
    DeviceOrderAisMnpMobileDetailPageComponent,
    DeviceOrderAisMnpEffectiveStartDatePageComponent,
    DeviceOrderAisMnpMobileCareAvaliblePageComponent,
    DeviceOrderAisMnpQrCodeResultPageComponent
  ]
})
export class DeviceOrderAisMnpModule { }
