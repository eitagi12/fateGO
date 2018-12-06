import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

import { DeviceOrderAisNewRegisterRoutingModule } from './device-order-ais-new-register-routing.module';
import { DeviceOrderAisNewRegisterValidateCustomerPageComponent } from './containers/device-order-ais-new-register-validate-customer-page/device-order-ais-new-register-validate-customer-page.component';
import { DeviceOrderAisNewRegisterValidateCustomerKeyInPageComponent } from './containers/device-order-ais-new-register-validate-customer-key-in-page/device-order-ais-new-register-validate-customer-key-in-page.component';
import { DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent } from './containers/device-order-ais-new-register-validate-customer-id-card-page/device-order-ais-new-register-validate-customer-id-card-page.component';
import { DeviceOrderAisNewRegisterPaymentDetailPageComponent } from './containers/device-order-ais-new-register-payment-detail-page/device-order-ais-new-register-payment-detail-page.component';
import { DeviceOrderAisNewRegisterCustomerInfoPageComponent } from './containers/device-order-ais-new-register-customer-info-page/device-order-ais-new-register-customer-info-page.component';
import { DeviceOrderAisNewRegisterSelectNumberPageComponent } from './containers/device-order-ais-new-register-select-number-page/device-order-ais-new-register-select-number-page.component';
import { DeviceOrderAisNewRegisterVerifyInstantSimPageComponent } from './containers/device-order-ais-new-register-verify-instant-sim-page/device-order-ais-new-register-verify-instant-sim-page.component';
import { DeviceOrderAisNewRegisterSelectPackagePageComponent } from './containers/device-order-ais-new-register-select-package-page/device-order-ais-new-register-select-package-page.component';
import { DeviceOrderAisNewRegisterConfirmUserInformationPageComponent } from './containers/device-order-ais-new-register-confirm-user-information-page/device-order-ais-new-register-confirm-user-information-page.component';
import { DeviceOrderAisNewRegisterEbillingAddressPageComponent } from './containers/device-order-ais-new-register-ebilling-address-page/device-order-ais-new-register-ebilling-address-page.component';
import { DeviceOrderAisNewRegisterMobileCarePageComponent } from './containers/device-order-ais-new-register-mobile-care-page/device-order-ais-new-register-mobile-care-page.component';
import { DeviceOrderAisNewRegisterSummaryPageComponent } from './containers/device-order-ais-new-register-summary-page/device-order-ais-new-register-summary-page.component';
import { DeviceOrderAisNewRegisterByPatternPageComponent } from './containers/device-order-ais-new-register-by-pattern-page/device-order-ais-new-register-by-pattern-page.component';
import { DeviceOrderAisNewRegisterAgreementPageComponent } from './containers/device-order-ais-new-register-agreement-page/device-order-ais-new-register-agreement-page.component';
import { DeviceOrderAisNewRegisterAgreementSignPageComponent } from './containers/device-order-ais-new-register-agreement-sign-page/device-order-ais-new-register-agreement-sign-page.component';
import { DeviceOrderAisNewRegisterPersoSimPageComponent } from './containers/device-order-ais-new-register-perso-sim-page/device-order-ais-new-register-perso-sim-page.component';
import { DeviceOrderAisNewRegisterDeviceSellingPageComponent } from './containers/device-order-ais-new-register-device-selling-page/device-order-ais-new-register-device-selling-page.component';
import { DeviceOrderAisNewRegisterFaceCapturePageComponent } from './containers/device-order-ais-new-register-face-capture-page/device-order-ais-new-register-face-capture-page.component';
import { DeviceOrderAisNewRegisterFaceComparePageComponent } from './containers/device-order-ais-new-register-face-compare-page/device-order-ais-new-register-face-compare-page.component';
import { DeviceOrderAisNewRegisterFaceConfirmPageComponent } from './containers/device-order-ais-new-register-face-confirm-page/device-order-ais-new-register-face-confirm-page.component';
import { DeviceOrderAisNewRegisterFaceQueuePageComponent } from './containers/device-order-ais-new-register-face-queue-page/device-order-ais-new-register-face-queue-page.component';
import { DeviceOrderAisNewRegisterResultPageComponent } from './containers/device-order-ais-new-register-result-page/device-order-ais-new-register-result-page.component';

@NgModule({
  imports: [
    CommonModule,
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
    DeviceOrderAisNewRegisterSelectPackagePageComponent,
    DeviceOrderAisNewRegisterConfirmUserInformationPageComponent,
    DeviceOrderAisNewRegisterEbillingAddressPageComponent,
    DeviceOrderAisNewRegisterMobileCarePageComponent,
    DeviceOrderAisNewRegisterSummaryPageComponent,
    DeviceOrderAisNewRegisterByPatternPageComponent,
    DeviceOrderAisNewRegisterAgreementPageComponent,
    DeviceOrderAisNewRegisterAgreementSignPageComponent,
    DeviceOrderAisNewRegisterPersoSimPageComponent,
    DeviceOrderAisNewRegisterDeviceSellingPageComponent,
    DeviceOrderAisNewRegisterFaceCapturePageComponent,
    DeviceOrderAisNewRegisterFaceComparePageComponent,
    DeviceOrderAisNewRegisterFaceConfirmPageComponent,
    DeviceOrderAisNewRegisterFaceQueuePageComponent,
    DeviceOrderAisNewRegisterResultPageComponent,
  ]
})
export class DeviceOrderAisNewRegisterModule { }
