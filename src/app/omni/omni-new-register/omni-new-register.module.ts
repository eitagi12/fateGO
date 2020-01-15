import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule, I18nService } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OmniNewRegisterRoutingModule } from './omni-new-register-routing.module';
import { OmniNewRegisterValidateCustomerKeyInPageComponent } from './containers/omni-new-register-validate-customer-key-in-page/omni-new-register-validate-customer-key-in-page.component';
import { OmniNewRegisterIdCardCapturePageComponent } from './containers/omni-new-register-id-card-capture-page/omni-new-register-id-card-capture-page.component';
import { OmniNewRegisterFaceCapturePageComponent } from './containers/omni-new-register-face-capture-page/omni-new-register-face-capture-page.component';
import { OmniNewRegisterFaceComparePageComponent } from './containers/omni-new-register-face-compare-page/omni-new-register-face-compare-page.component';
import { OmniNewRegisterFaceConfirmPageComponent } from './containers/omni-new-register-face-confirm-page/omni-new-register-face-confirm-page.component';
import { OmniNewRegisterVerifyInstantSimPageComponent } from './containers/omni-new-register-verify-instant-sim-page/omni-new-register-verify-instant-sim-page.component';
import { OmniNewRegisterCustomerInfoPageComponent } from './containers/omni-new-register-customer-info-page/omni-new-register-customer-info-page.component';
import { OmniNewRegisterMergeBillingPageComponent } from './containers/omni-new-register-merge-billing-page/omni-new-register-merge-billing-page.component';
import { OmniNewRegisterConfirmUserInformationPageComponent } from './containers/omni-new-register-confirm-user-information-page/omni-new-register-confirm-user-information-page.component';
import { OmniNewRegisterEbillingAddressPageComponent } from './containers/omni-new-register-ebilling-address-page/omni-new-register-ebilling-address-page.component';
import { OmniNewRegisterEbillingPageComponent } from './containers/omni-new-register-ebilling-page/omni-new-register-ebilling-page.component';
import { OmniNewRegisterSummaryPageComponent } from './containers/omni-new-register-summary-page/omni-new-register-summary-page.component';
import { OmniNewRegisterAgreementSignPageComponent } from './containers/omni-new-register-agreement-sign-page/omni-new-register-agreement-sign-page.component';
import { OmniNewRegisterPersoSimPageComponent } from './containers/omni-new-register-perso-sim-page/omni-new-register-perso-sim-page.component';
import { OmniNewRegisterResultPageComponent } from './containers/omni-new-register-result-page/omni-new-register-result-page.component';
import { OmniNewRegisterEapplicationPageComponent } from './containers/omni-new-register-eapplication-page/omni-new-register-eapplication-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { OmniNewRegisterEcontactPageComponent } from './containers/omni-new-register-econtract-page/omni-new-register-econtact-page.component';
import { OmniNewRegisterSummarySellerCodeComponent } from './containers/omni-new-register-summary-seller-code/omni-new-register-summary-seller-code.component';
import { OmniNewRegisterBillingInfoComponent } from './containers/omni-new-register-billing-info/omni-new-register-billing-info.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OmniNewRegisterRoutingModule,
    MyChannelSharedLibsModule,
    TranslateModule
  ],
  declarations: [
    OmniNewRegisterValidateCustomerKeyInPageComponent,
    OmniNewRegisterIdCardCapturePageComponent,
    OmniNewRegisterFaceCapturePageComponent,
    OmniNewRegisterFaceComparePageComponent,
    OmniNewRegisterFaceConfirmPageComponent,
    OmniNewRegisterVerifyInstantSimPageComponent,
    OmniNewRegisterCustomerInfoPageComponent,
    OmniNewRegisterMergeBillingPageComponent,
    OmniNewRegisterConfirmUserInformationPageComponent,
    OmniNewRegisterEbillingAddressPageComponent,
    OmniNewRegisterSummaryPageComponent,
    OmniNewRegisterAgreementSignPageComponent,
    OmniNewRegisterPersoSimPageComponent,
    OmniNewRegisterResultPageComponent,
    OmniNewRegisterEbillingPageComponent,
    OmniNewRegisterEapplicationPageComponent,
    OmniNewRegisterEcontactPageComponent,
    OmniNewRegisterSummarySellerCodeComponent,
    OmniNewRegisterBillingInfoComponent
  ],
})
export class OmniNewRegisterModule { }
