import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceOrderAisNewRegisterRoutingModule } from './device-order-ais-new-register-routing.module';
import { DeviceOrderAisNewRegisterValidateCustomerPageComponent } from './containers/device-order-ais-new-register-validate-customer-page/device-order-ais-new-register-validate-customer-page.component';
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
import { DeviceOrderAisNewRegisterEapplicationPageComponent } from './containers/device-order-ais-new-register-eapplication-page/device-order-ais-new-register-eapplication-page.component';
import { DeviceOrderAisNewRegisterEcontactPageComponent } from './containers/device-order-ais-new-register-econtact-page/device-order-ais-new-register-econtact-page.component';
import { DeviceOrderAisNewRegisterAgreementSignPageComponent } from './containers/device-order-ais-new-register-agreement-sign-page/device-order-ais-new-register-agreement-sign-page.component';
import { DeviceOrderAisNewRegisterPersoSimPageComponent } from './containers/device-order-ais-new-register-perso-sim-page/device-order-ais-new-register-perso-sim-page.component';
import { DeviceOrderAisNewRegisterFaceCapturePageComponent } from './containers/device-order-ais-new-register-face-capture-page/device-order-ais-new-register-face-capture-page.component';
import { DeviceOrderAisNewRegisterFaceComparePageComponent } from './containers/device-order-ais-new-register-face-compare-page/device-order-ais-new-register-face-compare-page.component';
import { DeviceOrderAisNewRegisterFaceConfirmPageComponent } from './containers/device-order-ais-new-register-face-confirm-page/device-order-ais-new-register-face-confirm-page.component';
import { DeviceOrderAisNewRegisterAggregatePageComponent } from './containers/device-order-ais-new-register-aggregate-page/device-order-ais-new-register-aggregate-page.component';
import { DeviceOrderAisNewRegisterQueuePageComponent } from './containers/device-order-ais-new-register-queue-page/device-order-ais-new-register-queue-page.component';
import { DeviceOrderAisNewRegisterResultPageComponent } from './containers/device-order-ais-new-register-result-page/device-order-ais-new-register-result-page.component';
import { DeviceOrderAisNewRegisterQrCodeSummaryPageComponent } from './containers/device-order-ais-new-register-qr-code-summary-page/device-order-ais-new-register-qr-code-summary-page.component';
import { DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent } from './containers/device-order-ais-new-register-qr-code-generator-page/device-order-ais-new-register-qr-code-generator-page.component';
import { DeviceOrderAisNewRegisterQrCodeQueuePageComponent } from './containers/device-order-ais-new-register-qr-code-queue-page/device-order-ais-new-register-qr-code-queue-page.component';
import { DeviceOrderAisNewRegisterQrCodeErrorPageComponent } from './containers/device-order-ais-new-register-qr-code-error-page/device-order-ais-new-register-qr-code-error-page.component';
import { DeviceOrderAisNewRegisterEbillingPageComponent } from './containers/device-order-ais-new-register-ebilling-page/device-order-ais-new-register-ebilling-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    DeviceOrderAisNewRegisterRoutingModule
  ],
  declarations: [
    DeviceOrderAisNewRegisterValidateCustomerPageComponent,
    DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent,
    DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent,
    DeviceOrderAisNewRegisterPaymentDetailPageComponent,
    DeviceOrderAisNewRegisterCustomerInfoPageComponent,
    DeviceOrderAisNewRegisterSelectNumberPageComponent,
    DeviceOrderAisNewRegisterVerifyInstantSimPageComponent,
    DeviceOrderAisNewRegisterByPatternPageComponent,
    DeviceOrderAisNewRegisterSelectPackagePageComponent,
    DeviceOrderAisNewRegisterConfirmUserInformationPageComponent,
    DeviceOrderAisNewRegisterEbillingAddressPageComponent,
    DeviceOrderAisNewRegisterMobileCarePageComponent,
    DeviceOrderAisNewRegisterSummaryPageComponent,
    DeviceOrderAisNewRegisterAgreementPageComponent,
    DeviceOrderAisNewRegisterEcontactPageComponent,
    DeviceOrderAisNewRegisterEapplicationPageComponent,
    DeviceOrderAisNewRegisterAgreementSignPageComponent,
    DeviceOrderAisNewRegisterPersoSimPageComponent,
    DeviceOrderAisNewRegisterFaceCapturePageComponent,
    DeviceOrderAisNewRegisterFaceComparePageComponent,
    DeviceOrderAisNewRegisterFaceConfirmPageComponent,
    DeviceOrderAisNewRegisterAggregatePageComponent,
    DeviceOrderAisNewRegisterQueuePageComponent,
    DeviceOrderAisNewRegisterResultPageComponent,
    DeviceOrderAisNewRegisterQrCodeSummaryPageComponent,
    DeviceOrderAisNewRegisterQrCodeGeneratorPageComponent,
    DeviceOrderAisNewRegisterQrCodeQueuePageComponent,
    DeviceOrderAisNewRegisterQrCodeErrorPageComponent,
    DeviceOrderAisNewRegisterEcontactPageComponent,
    DeviceOrderAisNewRegisterEbillingPageComponent,
  ]
})
export class DeviceOrderAisNewRegisterModule { }
