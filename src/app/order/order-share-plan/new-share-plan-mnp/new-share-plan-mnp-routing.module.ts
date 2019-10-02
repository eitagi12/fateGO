import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSharePlanMnpValidateCustomerPageComponent } from './containers/new-share-plan-mnp-validate-customer-page/new-share-plan-mnp-validate-customer-page.component';
import { NewSharePlanMnpValidateCustomerIdCardPageComponent } from './containers/new-share-plan-mnp-validate-customer-id-card-page/new-share-plan-mnp-validate-customer-id-card-page.component';
import { NewSharePlanMnpValidateCustomerKeyInPageComponent } from './containers/new-share-plan-mnp-validate-customer-key-in-page/new-share-plan-mnp-validate-customer-key-in-page.component';
import { NewSharePlanMnpCustomerInfoPageComponent } from './containers/new-share-plan-mnp-customer-info-page/new-share-plan-mnp-customer-info-page.component';
import { NewSharePlanMnpIdCardCapturePageComponent } from './containers/new-share-plan-mnp-id-card-capture-page/new-share-plan-mnp-id-card-capture-page.component';
import { NewSharePlanMnpFaceCapturePageComponent } from './containers/new-share-plan-mnp-face-capture-page/new-share-plan-mnp-face-capture-page.component';
import { NewSharePlanMnpFaceComparePageComponent } from './containers/new-share-plan-mnp-face-compare-page/new-share-plan-mnp-face-compare-page.component';
import { NewSharePlanMnpFaceConfirmPageComponent } from './containers/new-share-plan-mnp-face-confirm-page/new-share-plan-mnp-face-confirm-page.component';
import { NewSharePlanMnpSelectNumberPageComponent } from './containers/new-share-plan-mnp-select-number-page/new-share-plan-mnp-select-number-page.component';
import { NewSharePlanMnpVerifyInstantSimPageComponent } from './containers/new-share-plan-mnp-verify-instant-sim-page/new-share-plan-mnp-verify-instant-sim-page.component';
import { NewSharePlanMnpVerifyByPatternPageComponent } from './containers/new-share-plan-mnp-verify-by-pattern-page/new-share-plan-mnp-verify-by-pattern-page.component';
import { NewSharePlanMnpSelectPackageMasterPageComponent } from './containers/new-share-plan-mnp-select-package-master-page/new-share-plan-mnp-select-package-master-page.component';
import { NewSharePlanMnpNetworkTypePageComponent } from './containers/new-share-plan-mnp-network-type-page/new-share-plan-mnp-network-type-page.component';
import { NewSharePlanMnpSelectPackageMemberPageComponent } from './containers/new-share-plan-mnp-select-package-member-page/new-share-plan-mnp-select-package-member-page.component';
import { NewSharePlanMnpConfirmUserInformationPageComponent } from './containers/new-share-plan-mnp-confirm-user-information-page/new-share-plan-mnp-confirm-user-information-page.component';
import { NewSharePlanMnpEbillingAddressPageComponent } from './containers/new-share-plan-mnp-ebilling-address-page/new-share-plan-mnp-ebilling-address-page.component';
import { NewSharePlanMnpEbillingPageComponent } from './containers/new-share-plan-mnp-ebilling-page/new-share-plan-mnp-ebilling-page.component';
import { NewSharePlanMnpSummaryPageComponent } from './containers/new-share-plan-mnp-summary-page/new-share-plan-mnp-summary-page.component';
import { NewSharePlanMnpAgreementSignPageComponent } from './containers/new-share-plan-mnp-agreement-sign-page/new-share-plan-mnp-agreement-sign-page.component';
import { NewSharePlanMnpPersoSimNewPageComponent } from './containers/new-share-plan-mnp-perso-sim-new-page/new-share-plan-mnp-perso-sim-new-page.component';
import { NewSharePlanMnpPersoSimMnpPageComponent } from './containers/new-share-plan-mnp-perso-sim-mnp-page/new-share-plan-mnp-perso-sim-mnp-page.component';
import { NewSharePlanMnpResultPageComponent } from './containers/new-share-plan-mnp-result-page/new-share-plan-mnp-result-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
  { path: 'validate-customer', component: NewSharePlanMnpValidateCustomerPageComponent },
  { path: 'validate-customer-id-card', component: NewSharePlanMnpValidateCustomerIdCardPageComponent },
  { path: 'validate-customer-key-in', component: NewSharePlanMnpValidateCustomerKeyInPageComponent },
  { path: 'customer-info', component: NewSharePlanMnpCustomerInfoPageComponent },
  { path: 'id-card-capture', component: NewSharePlanMnpIdCardCapturePageComponent },
  { path: 'face-capture', component: NewSharePlanMnpFaceCapturePageComponent },
  { path: 'face-compare', component: NewSharePlanMnpFaceComparePageComponent },
  { path: 'face-confirm', component: NewSharePlanMnpFaceConfirmPageComponent },
  { path: 'select-number', component: NewSharePlanMnpSelectNumberPageComponent },
  { path: 'verify-instant-sim', component: NewSharePlanMnpVerifyInstantSimPageComponent },
  { path: 'verify-by-pattern', component: NewSharePlanMnpVerifyByPatternPageComponent },
  { path: 'select-package-master', component: NewSharePlanMnpSelectPackageMasterPageComponent },
  { path: 'network-type', component: NewSharePlanMnpNetworkTypePageComponent },
  { path: 'select-package-member', component: NewSharePlanMnpSelectPackageMemberPageComponent },
  { path: 'confirm-user-information', component: NewSharePlanMnpConfirmUserInformationPageComponent },
  { path: 'ebilling-address', component: NewSharePlanMnpEbillingAddressPageComponent },
  { path: 'ebilling', component: NewSharePlanMnpEbillingPageComponent },
  { path: 'summary', component: NewSharePlanMnpSummaryPageComponent },
  { path: 'agreement-sign', component: NewSharePlanMnpAgreementSignPageComponent },
  { path: 'perso-sim-new', component: NewSharePlanMnpPersoSimNewPageComponent },
  { path: 'perso-sim-mnp', component: NewSharePlanMnpPersoSimMnpPageComponent },
  { path: 'result', component: NewSharePlanMnpResultPageComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewSharePlanMnpRoutingModule { }
