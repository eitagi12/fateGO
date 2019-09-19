import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceOrderNewRegisterMnpRoutingModule } from './device-order-ais-share-plan-routing.module';
import { NewRegisterMnpAggregatePageComponent } from './new-register-mnp/containers/new-register-mnp-aggregate-page/new-register-mnp-aggregate-page.component';
import { NewRegisterMnpAgreementSignPageComponent } from './new-register-mnp/containers/new-register-mnp-agreement-sign-page/new-register-mnp-agreement-sign-page.component';
import { NewRegisterMnpConfirmUserInformationPageComponent } from './new-register-mnp/containers/new-register-mnp-confirm-user-information-page/new-register-mnp-confirm-user-information-page.component';
import { NewRegisterMnpCustomerInfoPageComponent } from './new-register-mnp/containers/new-register-mnp-customer-info-page/new-register-mnp-customer-info-page.component';
import { NewRegisterMnpEbillingAddressPageComponent } from './new-register-mnp/containers/new-register-mnp-ebilling-address-page/new-register-mnp-ebilling-address-page.component';
import { NewRegisterMnpEbillingPageComponent } from './new-register-mnp/containers/new-register-mnp-ebilling-page/new-register-mnp-ebilling-page.component';
import { NewRegisterMnpEcontactPageComponent } from './new-register-mnp/containers/new-register-mnp-econtact-page/new-register-mnp-econtact-page.component';
import { NewRegisterMnpFaceCapturePageComponent } from './new-register-mnp/containers/new-register-mnp-face-capture-page/new-register-mnp-face-capture-page.component';
import { NewRegisterMnpFaceComparePageComponent } from './new-register-mnp/containers/new-register-mnp-face-compare-page/new-register-mnp-face-compare-page.component';
import { NewRegisterMnpFaceConfirmPageComponent } from './new-register-mnp/containers/new-register-mnp-face-confirm-page/new-register-mnp-face-confirm-page.component';
import { NewRegisterMnpMobileCarePageComponent } from './new-register-mnp/containers/new-register-mnp-mobile-care-page/new-register-mnp-mobile-care-page.component';
import { NewRegisterMnpPaymentDetailPageComponent } from './new-register-mnp/containers/new-register-mnp-payment-detail-page/new-register-mnp-payment-detail-page.component';
import { NewRegisterMnpQrCodeGeneratorPageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-generator-page/new-register-mnp-qr-code-generator-page.component';
import { NewRegisterMnpQrCodeQueuePageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-queue-page/new-register-mnp-qr-code-queue-page.component';
import { NewRegisterMnpQrCodeSummaryPageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-summary-page/new-register-mnp-qr-code-summary-page.component';
import { NewRegisterMnpQueuePageComponent } from './new-register-mnp/containers/new-register-mnp-queue-page/new-register-mnp-queue-page.component';
import { NewRegisterMnpResultPageComponent } from './new-register-mnp/containers/new-register-mnp-result-page/new-register-mnp-result-page.component';
import { NewRegisterMnpSelectPackagePageComponent } from './new-register-mnp/containers/new-register-mnp-select-package-page/new-register-mnp-select-package-page.component';
import { NewRegisterMnpSummaryPageComponent } from './new-register-mnp/containers/new-register-mnp-summary-page/new-register-mnp-summary-page.component';
import { NewRegisterMnpValidateCustomerIdCardPageComponent } from './new-register-mnp/containers/new-register-mnp-validate-customer-id-card-page/new-register-mnp-validate-customer-id-card-page.component';
import { NewRegisterMnpValidateCustomerKeyInPageComponent } from './new-register-mnp/containers/new-register-mnp-validate-customer-key-in-page/new-register-mnp-validate-customer-key-in-page.component';
import { NewRegisterMnpValidateCustomerPageComponent } from './new-register-mnp/containers/new-register-mnp-validate-customer-page/new-register-mnp-validate-customer-page.component';
import { NewRegisterMnpEligibleMobilePageComponent } from './new-register-mnp/containers/new-register-mnp-eligible-mobile-page/new-register-mnp-eligible-mobile-page.component';
import { NewRegisterMnpMobileDetailPageComponent } from './new-register-mnp/containers/new-register-mnp-mobile-detail-page/new-register-mnp-mobile-detail-page.component';
import { NewRegisterMnpEffectiveStartDatePageComponent } from './new-register-mnp/containers/new-register-mnp-effective-start-date-page/new-register-mnp-effective-start-date-page.component';
import { NewRegisterMnpMobileCareAvaliblePageComponent } from './new-register-mnp/containers/new-register-mnp-mobile-care-avalible-page/new-register-mnp-mobile-care-avalible-page.component';
import { NewRegisterMnpQrCodeResultPageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-result-page/new-register-mnp-qr-code-result-page.component';
import { NewRegisterMnpSelectPackageOntopPageComponent } from './new-register-mnp/containers/new-register-mnp-select-package-ontop-page/new-register-mnp-select-package-ontop-page.component';
import { NewRegisterMnpSelectNumberPageComponent } from './new-register-mnp/containers/new-register-mnp-select-number-page/new-register-mnp-select-number-page.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TranslateModule,
    DeviceOrderNewRegisterMnpRoutingModule
  ],
  declarations: [
    NewRegisterMnpAggregatePageComponent,
    NewRegisterMnpAgreementSignPageComponent,
    NewRegisterMnpConfirmUserInformationPageComponent,
    NewRegisterMnpCustomerInfoPageComponent,
    NewRegisterMnpEbillingAddressPageComponent,
    NewRegisterMnpEbillingPageComponent,
    NewRegisterMnpEcontactPageComponent,
    NewRegisterMnpFaceCapturePageComponent,
    NewRegisterMnpFaceComparePageComponent,
    NewRegisterMnpFaceConfirmPageComponent,
    NewRegisterMnpMobileCarePageComponent,
    NewRegisterMnpPaymentDetailPageComponent,
    NewRegisterMnpQrCodeGeneratorPageComponent,
    NewRegisterMnpQrCodeQueuePageComponent,
    NewRegisterMnpQrCodeSummaryPageComponent,
    NewRegisterMnpQueuePageComponent,
    NewRegisterMnpResultPageComponent,
    NewRegisterMnpSelectPackagePageComponent,
    NewRegisterMnpSummaryPageComponent,
    NewRegisterMnpValidateCustomerIdCardPageComponent,
    NewRegisterMnpValidateCustomerKeyInPageComponent,
    NewRegisterMnpValidateCustomerPageComponent,
    NewRegisterMnpEligibleMobilePageComponent,
    NewRegisterMnpMobileDetailPageComponent,
    NewRegisterMnpEffectiveStartDatePageComponent,
    NewRegisterMnpMobileCareAvaliblePageComponent,
    NewRegisterMnpQrCodeResultPageComponent,
    NewRegisterMnpSelectPackageOntopPageComponent,
    NewRegisterMnpSelectNumberPageComponent
  ]
})
export class DeviceOrderAisSharePlanModule { }
