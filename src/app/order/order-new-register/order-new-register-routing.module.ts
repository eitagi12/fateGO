import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderNewRegisterValidateCustomerPageComponent } from './containers/order-new-register-validate-customer-page/order-new-register-validate-customer-page.component';
import { OrderNewRegisterValidateCustomerIdCardPageComponent } from './containers/order-new-register-validate-customer-id-card-page/order-new-register-validate-customer-id-card-page.component';
import { OrderNewRegisterValidateCustomerKeyInPageComponent } from './containers/order-new-register-validate-customer-key-in-page/order-new-register-validate-customer-key-in-page.component';
import { OrderNewRegisterIdCardCapturePageComponent } from './containers/order-new-register-id-card-capture-page/order-new-register-id-card-capture-page.component';
import { OrderNewRegisterFaceCapturePageComponent } from './containers/order-new-register-face-capture-page/order-new-register-face-capture-page.component';
import { OrderNewRegisterFaceComparePageComponent } from './containers/order-new-register-face-compare-page/order-new-register-face-compare-page.component';
import { OrderNewRegisterFaceConfirmPageComponent } from './containers/order-new-register-face-confirm-page/order-new-register-face-confirm-page.component';
import { OrderNewRegisterSelectNumberPageComponent } from './containers/order-new-register-select-number-page/order-new-register-select-number-page.component';
import { OrderNewRegisterVerifyInstantSimPageComponent } from './containers/order-new-register-verify-instant-sim-page/order-new-register-verify-instant-sim-page.component';
import { OrderNewRegisterByPatternPageComponent } from './containers/order-new-register-by-pattern-page/order-new-register-by-pattern-page.component';
import { OrderNewRegisterCustomerInfoPageComponent } from './containers/order-new-register-customer-info-page/order-new-register-customer-info-page.component';
import { OrderNewRegisterSelectPackagePageComponent } from './containers/order-new-register-select-package-page/order-new-register-select-package-page.component';
import { OrderNewRegisterOneLovePageComponent } from './containers/order-new-register-one-love-page/order-new-register-one-love-page.component';
import { OrderNewRegisterOnTopPageComponent } from './containers/order-new-register-on-top-page/order-new-register-on-top-page.component';
import { OrderNewRegisterMergeBillingPageComponent } from './containers/order-new-register-merge-billing-page/order-new-register-merge-billing-page.component';
import { OrderNewRegisterConfirmUserInformationPageComponent } from './containers/order-new-register-confirm-user-information-page/order-new-register-confirm-user-information-page.component';
import { OrderNewRegisterEbillingAddressPageComponent } from './containers/order-new-register-ebilling-address-page/order-new-register-ebilling-address-page.component';
import { OrderNewRegisterEbillingPageComponent } from './containers/order-new-register-ebilling-page/order-new-register-ebilling-page.component';
import { OrderNewRegisterSummaryPageComponent } from './containers/order-new-register-summary-page/order-new-register-summary-page.component';
import { OrderNewRegisterAgreementSignPageComponent } from './containers/order-new-register-agreement-sign-page/order-new-register-agreement-sign-page.component';
import { OrderNewRegisterPersoSimPageComponent } from './containers/order-new-register-perso-sim-page/order-new-register-perso-sim-page.component';
import { OrderNewRegisterResultPageComponent } from './containers/order-new-register-result-page/order-new-register-result-page.component';
import { OrderNewRegisterEapplicationPageComponent } from './containers/order-new-register-eapplication-page/order-new-register-eapplication-page.component';
import { OrderNewRegisterVerifyDocumentPageComponent } from './containers/order-new-register-verify-document-page/order-new-register-verify-document-page.component';
import { OrderNewRegisterPassportInfoPageComponent } from 'src/app/order/order-new-register/containers/order-new-register-passport-info-page/order-new-register-passport-info-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'validate-customer-id-card', pathMatch: 'full' },
  { path: 'validate-customer', component: OrderNewRegisterValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: OrderNewRegisterValidateCustomerIdCardPageComponent },
  { path: 'validate-customer-key-in', component: OrderNewRegisterValidateCustomerKeyInPageComponent },
  { path: 'id-card-capture', component: OrderNewRegisterIdCardCapturePageComponent },
  { path: 'face-capture', component: OrderNewRegisterFaceCapturePageComponent },
  { path: 'face-compare', component: OrderNewRegisterFaceComparePageComponent },
  { path: 'face-confirm', component: OrderNewRegisterFaceConfirmPageComponent },
  { path: 'select-number', component: OrderNewRegisterSelectNumberPageComponent },
  { path: 'verify-instant-sim', component: OrderNewRegisterVerifyInstantSimPageComponent },
  { path: 'by-pattern', component: OrderNewRegisterByPatternPageComponent },
  { path: 'customer-info', component: OrderNewRegisterCustomerInfoPageComponent },
  { path: 'select-package', component: OrderNewRegisterSelectPackagePageComponent },
  { path: 'one-love', component: OrderNewRegisterOneLovePageComponent },
  { path: 'on-top', component: OrderNewRegisterOnTopPageComponent },
  { path: 'merge-billing', component: OrderNewRegisterMergeBillingPageComponent },
  { path: 'confirm-user-information', component: OrderNewRegisterConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: OrderNewRegisterEbillingAddressPageComponent },
  { path: 'ebilling', component: OrderNewRegisterEbillingPageComponent },
  { path: 'summary', component: OrderNewRegisterSummaryPageComponent },
  { path: 'agreement-sign', component: OrderNewRegisterAgreementSignPageComponent },
  { path: 'perso-sim', component: OrderNewRegisterPersoSimPageComponent },
  { path: 'result', component: OrderNewRegisterResultPageComponent },
  { path: 'eapplication', component: OrderNewRegisterEapplicationPageComponent },
  { path: 'verify-document', component: OrderNewRegisterVerifyDocumentPageComponent},
  { path: 'passport-info', component: OrderNewRegisterPassportInfoPageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderNewRegisterRoutingModule {


}
