import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OrderBlockChainRoutingModule } from 'src/app/order/order-blcok-chain/order-block-chain-routing.module';
import { OrderBlockChainValidateCustomerIdCardPageComponent } from './containers/order-block-chain-validate-customer-id-card-page/order-block-chain-validate-customer-id-card-page.component';
import { OrderBlockChainEligibleMobilePageComponent } from './containers/order-block-chain-eligible-mobile-page/order-block-chain-eligible-mobile-page.component';
import { OrderBlockChainAgreementSignPageComponent } from './containers/order-block-chain-agreement-sign-page/order-block-chain-agreement-sign-page.component';
import { OrderBlockChainFaceCapturePageComponent } from './containers/order-block-chain-face-capture-page/order-block-chain-face-capture-page.component';
import { OrderBlockChainFaceComparePageComponent } from './containers/order-block-chain-face-compare-page/order-block-chain-face-compare-page.component';
import { OrderBlockChainFaceConfirmPageComponent } from './containers/order-block-chain-face-confirm-page/order-block-chain-face-confirm-page.component';
import { OrderBlockChainResultPageComponent } from './containers/order-block-chain-result-page/order-block-chain-result-page.component';

@NgModule({
  imports: [
    CommonModule,
    OrderBlockChainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TranslateModule
  ],
  declarations: [
    OrderBlockChainValidateCustomerIdCardPageComponent,
    OrderBlockChainEligibleMobilePageComponent,
    OrderBlockChainAgreementSignPageComponent,
    OrderBlockChainFaceCapturePageComponent,
    OrderBlockChainFaceComparePageComponent,
    OrderBlockChainFaceConfirmPageComponent,
    OrderBlockChainResultPageComponent]
})
export class OrderBlockChainModule { }
