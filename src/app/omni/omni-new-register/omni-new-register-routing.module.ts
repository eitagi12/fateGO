import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { OmniNewRegisterSummaryPageComponent } from './containers/omni-new-register-summary-page/omni-new-register-summary-page.component';
import { OmniNewRegisterAgreementSignKeyInPageComponent } from './containers/omni-new-register-agreement-sign-key-in-page/omni-new-register-agreement-sign-key-in.component';
import { OmniNewRegisterResultPageComponent } from './containers/omni-new-register-result-page/omni-new-register-result-page.component';
import { OmniNewRegisterEapplicationPageComponent } from './containers/omni-new-register-eapplication-page/omni-new-register-eapplication-page.component';
import { OmniNewRegisterEcontactPageComponent } from './containers/omni-new-register-econtract-page/omni-new-register-econtact-page.component';
import { OmniNewRegisterValidateCustomerPageComponent } from './containers/omni-new-register-validate-customer-page/omni-new-register-validate-customer-page.component';
import { OmniNewRegisterEbillingPageComponent } from './containers/omni-new-register-ebilling-page/omni-new-register-ebilling-page.component';
import { OmniNewRegisterPersoSimPageComponent } from './containers/omni-new-register-perso-sim-new-page/omni-new-register-perso-sim-new-page.component';
import { OmniNewRegisterAgreementSignPageComponent } from './containers/omni-new-register-agreement-sign-page/omni-new-register-agreement-sign-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer-key-in', pathMatch: 'full' },
  { path: 'validate-customer-key-in', component: OmniNewRegisterValidateCustomerKeyInPageComponent },
  { path: 'id-card-capture', component: OmniNewRegisterIdCardCapturePageComponent },
  { path: 'face-capture', component: OmniNewRegisterFaceCapturePageComponent },
  { path: 'face-compare', component: OmniNewRegisterFaceComparePageComponent },
  { path: 'face-confirm', component: OmniNewRegisterFaceConfirmPageComponent },
  { path: 'verify-instant-sim', component: OmniNewRegisterVerifyInstantSimPageComponent },
  { path: 'customer-info', component: OmniNewRegisterCustomerInfoPageComponent },
  { path: 'merge-billing', component: OmniNewRegisterMergeBillingPageComponent },
  { path: 'confirm-user-information', component: OmniNewRegisterConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: OmniNewRegisterEbillingAddressPageComponent },
  { path: 'ebilling', component: OmniNewRegisterEbillingPageComponent },
  { path: 'summary', component: OmniNewRegisterSummaryPageComponent },
  { path: 'agreement-sign', component: OmniNewRegisterAgreementSignPageComponent },
  { path: 'agreement-sign-key-in', component: OmniNewRegisterAgreementSignKeyInPageComponent },
  { path: 'perso-sim', component: OmniNewRegisterPersoSimPageComponent },
  { path: 'result', component: OmniNewRegisterResultPageComponent },
  { path: 'eapplication', component: OmniNewRegisterEapplicationPageComponent },
  { path: 'econtract', component: OmniNewRegisterEcontactPageComponent },
  {path: 'validate', component: OmniNewRegisterValidateCustomerPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmniNewRegisterRoutingModule {

}
