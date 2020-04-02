import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewRegisterMnpAggregatePageComponent } from './containers/new-register-mnp-aggregate-page/new-register-mnp-aggregate-page.component';
import { NewRegisterMnpAgreementSignPageComponent } from './containers/new-register-mnp-agreement-sign-page/new-register-mnp-agreement-sign-page.component';
import { NewRegisterMnpConfirmUserInformationPageComponent } from './containers/new-register-mnp-confirm-user-information-page/new-register-mnp-confirm-user-information-page.component';
import { NewRegisterMnpCustomerInfoPageComponent } from './containers/new-register-mnp-customer-info-page/new-register-mnp-customer-info-page.component';
import { NewRegisterMnpEbillingAddressPageComponent } from './containers/new-register-mnp-ebilling-address-page/new-register-mnp-ebilling-address-page.component';
import { NewRegisterMnpEbillingPageComponent } from './containers/new-register-mnp-ebilling-page/new-register-mnp-ebilling-page.component';
import { NewRegisterMnpEcontactPageComponent } from './containers/new-register-mnp-econtact-page/new-register-mnp-econtact-page.component';
import { NewRegisterMnpFaceCapturePageComponent } from './containers/new-register-mnp-face-capture-page/new-register-mnp-face-capture-page.component';
import { NewRegisterMnpFaceComparePageComponent } from './containers/new-register-mnp-face-compare-page/new-register-mnp-face-compare-page.component';
import { NewRegisterMnpFaceConfirmPageComponent } from './containers/new-register-mnp-face-confirm-page/new-register-mnp-face-confirm-page.component';
import { NewRegisterMnpMobileCarePageComponent } from './containers/new-register-mnp-mobile-care-page/new-register-mnp-mobile-care-page.component';
import { NewRegisterMnpQrCodeGeneratorPageComponent } from './containers/new-register-mnp-qr-code-generator-page/new-register-mnp-qr-code-generator-page.component';
import { NewRegisterMnpQrCodeQueuePageComponent } from './containers/new-register-mnp-qr-code-queue-page/new-register-mnp-qr-code-queue-page.component';
import { NewRegisterMnpQrCodeSummaryPageComponent } from './containers/new-register-mnp-qr-code-summary-page/new-register-mnp-qr-code-summary-page.component';
import { NewRegisterMnpQueuePageComponent } from './containers/new-register-mnp-queue-page/new-register-mnp-queue-page.component';
import { NewRegisterMnpResultPageComponent } from './containers/new-register-mnp-result-page/new-register-mnp-result-page.component';
import { NewRegisterMnpSelectPackagePageComponent } from './containers/new-register-mnp-select-package-page/new-register-mnp-select-package-page.component';
import { NewRegisterMnpSummaryPageComponent } from './containers/new-register-mnp-summary-page/new-register-mnp-summary-page.component';
import { NewRegisterMnpEligibleMobilePageComponent } from './containers/new-register-mnp-eligible-mobile-page/new-register-mnp-eligible-mobile-page.component';
import { NewRegisterMnpMobileDetailPageComponent } from './containers/new-register-mnp-mobile-detail-page/new-register-mnp-mobile-detail-page.component';
import { NewRegisterMnpEffectiveStartDatePageComponent } from './containers/new-register-mnp-effective-start-date-page/new-register-mnp-effective-start-date-page.component';
import { NewRegisterMnpMobileCareAvaliblePageComponent } from './containers/new-register-mnp-mobile-care-avalible-page/new-register-mnp-mobile-care-avalible-page.component';
import { NewRegisterMnpQrCodeResultPageComponent } from './containers/new-register-mnp-qr-code-result-page/new-register-mnp-qr-code-result-page.component';
import { NewRegisterMnpSelectPackageOntopPageComponent } from './containers/new-register-mnp-select-package-ontop-page/new-register-mnp-select-package-ontop-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { NewRegisterMnpRoutingModule } from './new-register-mnp-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NewRegisterMnpValidateCustomerPageComponent } from './containers/new-register-mnp-validate-customer-page/new-register-mnp-validate-customer-page.component';
import { NewRegisterMnpValidateCustomerKeyInPageComponent } from './containers/new-register-mnp-validate-customer-key-in-page/new-register-mnp-validate-customer-key-in-page.component';
import { NewRegisterMnpValidateCustomerIdCardPageComponent } from './containers/new-register-mnp-validate-customer-id-card-page/new-register-mnp-validate-customer-id-card-page.component';
import { NewRegisterMnpNetworkTypePageComponent } from './containers/new-register-mnp-network-type-page/new-register-mnp-network-type-page.component';
import { NewRegisterMnpVerifyInstantSimPageComponent } from './containers/new-register-mnp-verify-instant-sim-page/new-register-mnp-verify-instant-sim-page.component';
import { NewRegisterMnpSelectNumberComponent } from './containers/new-register-mnp-select-number/new-register-mnp-select-number.component';
import { NewRegisterMnpPaymentDetailPageComponent } from './containers/new-register-mnp-payment-detail-page/new-register-mnp-payment-detail-page.component';
import { NewRegisterMnpByPatternPageComponent } from './containers/new-register-mnp-by-pattern-page/new-register-mnp-by-pattern-page.component';
import { NewRegisterMnpEapplicationPageComponent } from './containers/new-register-mnp-eapplication-page/new-register-mnp-eapplication-page.component';
import { NewRegisterMnpPersoSimMasterPageComponent } from './containers/new-register-mnp-perso-sim-master-page/new-register-mnp-perso-sim-master-page.component';
import { NewRegisterMnpPersoSimMemberPageComponent } from './containers/new-register-mnp-perso-sim-member-page/new-register-mnp-perso-sim-member-page.component';
import { NewRegisterMnpSelectReasonPageComponent } from './containers/new-register-mnp-select-reason-page/new-register-mnp-select-reason-page.component';
import { NewRegisterMnpSelectPackageMemberComponent } from './containers/new-register-mnp-select-package-member/new-register-mnp-select-package-member.component';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { LazyLoadImageComponent } from './components/lazy-load-image/lazy-load-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    NewRegisterMnpRoutingModule,
    TranslateModule
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
    NewRegisterMnpQrCodeGeneratorPageComponent,
    NewRegisterMnpQrCodeQueuePageComponent,
    NewRegisterMnpQrCodeSummaryPageComponent,
    NewRegisterMnpQueuePageComponent,
    NewRegisterMnpResultPageComponent,
    NewRegisterMnpSelectPackagePageComponent,
    NewRegisterMnpSummaryPageComponent,
    NewRegisterMnpEligibleMobilePageComponent,
    NewRegisterMnpMobileDetailPageComponent,
    NewRegisterMnpEffectiveStartDatePageComponent,
    NewRegisterMnpMobileCareAvaliblePageComponent,
    NewRegisterMnpQrCodeResultPageComponent,
    NewRegisterMnpSelectPackageOntopPageComponent,
    NewRegisterMnpValidateCustomerPageComponent,
    NewRegisterMnpValidateCustomerKeyInPageComponent,
    NewRegisterMnpValidateCustomerIdCardPageComponent,
    NewRegisterMnpNetworkTypePageComponent,
    NewRegisterMnpVerifyInstantSimPageComponent,
    NewRegisterMnpSelectNumberComponent,
    NewRegisterMnpPaymentDetailPageComponent,
    NewRegisterMnpByPatternPageComponent,
    NewRegisterMnpEapplicationPageComponent,
    NewRegisterMnpPersoSimMasterPageComponent,
    NewRegisterMnpPersoSimMemberPageComponent,
    NewRegisterMnpSelectReasonPageComponent,
    NewRegisterMnpSelectPackageMemberComponent,
    PaymentDetailComponent,
    LazyLoadImageComponent
  ]
})
export class NewRegisterMnpModule { }
