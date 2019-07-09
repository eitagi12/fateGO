import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderBlockChainValidateCustomerIdCardPageComponent } from './containers/order-block-chain-validate-customer-id-card-page/order-block-chain-validate-customer-id-card-page.component';
import { OrderBlockChainEligibleMobilePageComponent } from './containers/order-block-chain-eligible-mobile-page/order-block-chain-eligible-mobile-page.component';
import { OrderBlockChainAgreementSignPageComponent } from './containers/order-block-chain-agreement-sign-page/order-block-chain-agreement-sign-page.component';
import { OrderBlockChainFaceCapturePageComponent } from './containers/order-block-chain-face-capture-page/order-block-chain-face-capture-page.component';
import { OrderBlockChainFaceComparePageComponent } from './containers/order-block-chain-face-compare-page/order-block-chain-face-compare-page.component';
import { OrderBlockChainFaceConfirmPageComponent } from './containers/order-block-chain-face-confirm-page/order-block-chain-face-confirm-page.component';
import { OrderBlockChainResultPageComponent } from './containers/order-block-chain-result-page/order-block-chain-result-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'validate-customer-id-card', pathMatch: 'full' },
  { path: 'validate-customer-id-card', component: OrderBlockChainValidateCustomerIdCardPageComponent },
  { path: 'eligible-mobile', component: OrderBlockChainEligibleMobilePageComponent },
  { path: 'agreement-sign', component: OrderBlockChainAgreementSignPageComponent },
  { path: 'face-capture', component: OrderBlockChainFaceCapturePageComponent },
  { path: 'face-compare', component: OrderBlockChainFaceComparePageComponent },
  { path: 'face-confirm', component: OrderBlockChainFaceConfirmPageComponent },
  { path: 'result', component: OrderBlockChainResultPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderBlockChainRoutingModule { }
