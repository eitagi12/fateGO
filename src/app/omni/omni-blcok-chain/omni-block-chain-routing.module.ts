import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OmniBlockChainValidateCustomerIdCardPageComponent } from './containers/omni-block-chain-validate-customer-id-card-page/omni-block-chain-validate-customer-id-card-page.component';
import { OmniBlockChainEligibleMobilePageComponent } from './containers/omni-block-chain-eligible-mobile-page/omni-block-chain-eligible-mobile-page.component';
import { OmniBlockChainAgreementSignPageComponent } from './containers/omni-block-chain-agreement-sign-page/omni-block-chain-agreement-sign-page.component';
import { OmniBlockChainLowPageComponent } from './containers/omni-block-chain-low-page/omni-block-chain-low-page.component';
import { OmniBlockChainFaceCapturePageComponent } from './containers/omni-block-chain-face-capture-page/omni-block-chain-face-capture-page.component';
import { OmniBlockChainFaceComparePageComponent } from './containers/omni-block-chain-face-compare-page/omni-block-chain-face-compare-page.component';
import { OmniBlockChainFaceConfirmPageComponent } from './containers/omni-block-chain-face-confirm-page/omni-block-chain-face-confirm-page.component';
import { OmniBlockChainResultPageComponent } from './containers/omni-block-chain-result-page/omni-block-chain-result-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer-id-card', pathMatch: 'full' },
  { path: 'validate-customer-id-card', component: OmniBlockChainValidateCustomerIdCardPageComponent },
  { path: 'eligible-mobile', component: OmniBlockChainEligibleMobilePageComponent },
  { path: 'agreement-sign', component: OmniBlockChainAgreementSignPageComponent },
  { path: 'low', component: OmniBlockChainLowPageComponent },
  { path: 'face-capture', component: OmniBlockChainFaceCapturePageComponent },
  { path: 'face-compare', component: OmniBlockChainFaceComparePageComponent },
  { path: 'face-confirm', component: OmniBlockChainFaceConfirmPageComponent },
  { path: 'result', component: OmniBlockChainResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmniBlockChainRoutingModule { }
