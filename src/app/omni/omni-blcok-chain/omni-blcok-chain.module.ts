import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OmniBlockChainValidateCustomerIdCardPageComponent } from './containers/omni-block-chain-validate-customer-id-card-page/omni-block-chain-validate-customer-id-card-page.component';
import { OmniBlockChainEligibleMobilePageComponent } from './containers/omni-block-chain-eligible-mobile-page/omni-block-chain-eligible-mobile-page.component';
import { OmniBlockChainAgreementSignPageComponent } from './containers/omni-block-chain-agreement-sign-page/omni-block-chain-agreement-sign-page.component';
import { OmniBlockChainFaceCapturePageComponent } from './containers/omni-block-chain-face-capture-page/omni-block-chain-face-capture-page.component';
import { OmniBlockChainFaceComparePageComponent } from './containers/omni-block-chain-face-compare-page/omni-block-chain-face-compare-page.component';
import { OmniBlockChainFaceConfirmPageComponent } from './containers/omni-block-chain-face-confirm-page/omni-block-chain-face-confirm-page.component';
import { OmniBlockChainResultPageComponent } from './containers/omni-block-chain-result-page/omni-block-chain-result-page.component';
import { OmniBlockChainLowPageComponent } from './containers/omni-block-chain-low-page/omni-block-chain-low-page.component';
import { OmniBlockChainRoutingModule } from './omni-block-chain-routing.module';

@NgModule({
  imports: [
    CommonModule,
    OmniBlockChainRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TranslateModule
  ],
  declarations: [
    OmniBlockChainValidateCustomerIdCardPageComponent,
    OmniBlockChainEligibleMobilePageComponent,
    OmniBlockChainAgreementSignPageComponent,
    OmniBlockChainFaceCapturePageComponent,
    OmniBlockChainFaceComparePageComponent,
    OmniBlockChainFaceConfirmPageComponent,
    OmniBlockChainResultPageComponent,
    OmniBlockChainLowPageComponent]
})
export class OmniBlockChainModule { }
