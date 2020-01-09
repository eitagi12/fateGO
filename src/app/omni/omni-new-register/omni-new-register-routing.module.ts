import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OmniNewRegisterValidateCustomerPageComponent } from './containers/omni-new-register-validate-customer-page/omni-new-register-validate-customer-page.component';
import { OmniNewRegisterValidateCustomerIdCardPageComponent } from './containers/omni-new-register-validate-customer-id-card-page/omni-new-register-validate-customer-id-card-page.component';
import { OmniNewRegisterValidateCustomerKeyInPageComponent } from './containers/omni-new-register-validate-customer-key-in-page/omni-new-register-validate-customer-key-in-page.component';
import { OmniNewRegisterIdCardCapturePageComponent } from './containers/omni-new-register-id-card-capture-page/omni-new-register-id-card-capture-page.component';
import { OmniNewRegisterFaceCapturePageComponent } from './containers/omni-new-register-face-capture-page/omni-new-register-face-capture-page.component';
import { OmniNewRegisterFaceComparePageComponent } from './containers/omni-new-register-face-compare-page/omni-new-register-face-compare-page.component';
import { OmniNewRegisterFaceConfirmPageComponent } from './containers/omni-new-register-face-confirm-page/omni-new-register-face-confirm-page.component';
// tslint:disable-next-line: max-line-length
// import { OmniNewRegisterSelectNumberPageComponent } from './containers/omni-new-register-select-number-page/omni-new-register-select-number-page.component';
import { OmniNewRegisterVerifyInstantSimPageComponent } from './containers/omni-new-register-verify-instant-sim-page/omni-new-register-verify-instant-sim-page.component';
import { OmniNewRegisterByPatternPageComponent } from './containers/omni-new-register-by-pattern-page/omni-new-register-by-pattern-page.component';
import { OmniNewRegisterCustomerInfoPageComponent } from './containers/omni-new-register-customer-info-page/omni-new-register-customer-info-page.component';
// tslint:disable-next-line: max-line-length
// import { OmniNewRegisterSelectPackagePageComponent } from './containers/omni-new-register-select-package-page/omni-new-register-select-package-page.component';
import { OmniNewRegisterOneLovePageComponent } from './containers/omni-new-register-one-love-page/omni-new-register-one-love-page.component';
import { OmniNewRegisterOnTopPageComponent } from './containers/omni-new-register-on-top-page/omni-new-register-on-top-page.component';
import { OmniNewRegisterMergeBillingPageComponent } from './containers/omni-new-register-merge-billing-page/omni-new-register-merge-billing-page.component';
import { OmniNewRegisterConfirmUserInformationPageComponent } from './containers/omni-new-register-confirm-user-information-page/omni-new-register-confirm-user-information-page.component';
import { OmniNewRegisterEbillingAddressPageComponent } from './containers/omni-new-register-ebilling-address-page/omni-new-register-ebilling-address-page.component';
import { OmniNewRegisterEbillingPageComponent } from './containers/omni-new-register-ebilling-page/omni-new-register-ebilling-page.component';
import { OmniNewRegisterSummaryPageComponent } from './containers/omni-new-register-summary-page/omni-new-register-summary-page.component';
import { OmniNewRegisterAgreementSignPageComponent } from './containers/omni-new-register-agreement-sign-page/omni-new-register-agreement-sign-page.component';
import { OmniNewRegisterPersoSimPageComponent } from './containers/omni-new-register-perso-sim-page/omni-new-register-perso-sim-page.component';
import { OmniNewRegisterResultPageComponent } from './containers/omni-new-register-result-page/omni-new-register-result-page.component';
import { OmniNewRegisterEapplicationPageComponent } from './containers/omni-new-register-eapplication-page/omni-new-register-eapplication-page.component';
import { OmniNewRegisterVerifyDocumentPageComponent } from './containers/omni-new-register-verify-document-page/omni-new-register-verify-document-page.component';
import { OmniNewRegisterPassportInfoPageComponent } from 'src/app/omni/omni-new-register/containers/omni-new-register-passport-info-page/omni-new-register-passport-info-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'verify-document', pathMatch: 'full' },
  { path: 'validate-customer', component: OmniNewRegisterValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: OmniNewRegisterValidateCustomerIdCardPageComponent },
  { path: 'validate-customer-key-in', component: OmniNewRegisterValidateCustomerKeyInPageComponent },
  { path: 'id-card-capture', component: OmniNewRegisterIdCardCapturePageComponent },
  { path: 'face-capture', component: OmniNewRegisterFaceCapturePageComponent },
  { path: 'face-compare', component: OmniNewRegisterFaceComparePageComponent },
  { path: 'face-confirm', component: OmniNewRegisterFaceConfirmPageComponent },
  // { path: 'select-number', component: OmniNewRegisterSelectNumberPageComponent },
  { path: 'verify-instant-sim', component: OmniNewRegisterVerifyInstantSimPageComponent },
  { path: 'by-pattern', component: OmniNewRegisterByPatternPageComponent },
  { path: 'customer-info', component: OmniNewRegisterCustomerInfoPageComponent },
  // { path: 'select-package', component: OmniNewRegisterSelectPackagePageComponent },
  { path: 'one-love', component: OmniNewRegisterOneLovePageComponent },
  { path: 'on-top', component: OmniNewRegisterOnTopPageComponent },
  { path: 'merge-billing', component: OmniNewRegisterMergeBillingPageComponent },
  { path: 'confirm-user-information', component: OmniNewRegisterConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: OmniNewRegisterEbillingAddressPageComponent },
  { path: 'ebilling', component: OmniNewRegisterEbillingPageComponent },
  { path: 'summary', component: OmniNewRegisterSummaryPageComponent },
  { path: 'agreement-sign', component: OmniNewRegisterAgreementSignPageComponent },
  { path: 'perso-sim', component: OmniNewRegisterPersoSimPageComponent },
  { path: 'result', component: OmniNewRegisterResultPageComponent },
  { path: 'eapplication', component: OmniNewRegisterEapplicationPageComponent },
  { path: 'verify-document', component: OmniNewRegisterVerifyDocumentPageComponent},
  { path: 'passport-info', component: OmniNewRegisterPassportInfoPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmniNewRegisterRoutingModule {

}
