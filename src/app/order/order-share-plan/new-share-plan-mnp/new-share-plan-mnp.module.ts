// Module
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewSharePlanMnpRoutingModule } from './new-share-plan-mnp-routing.module';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
// Component
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
import { BillingInfoComponent } from './components/billing-info/billing-info.component';
import { ConfirmCustomerInfoComponent } from './components/confirm-customer-info/confirm-customer-info.component';
import { PrinterComponent } from './components/printer/printer.component';
import { ResizeImageComponent } from './components/resize-image/resize-image.component';
import { SummarySellerCodeComponent } from './components/summary-seller-code/summary-seller-code.component';

@NgModule({
  imports: [
    CommonModule,
    NewSharePlanMnpRoutingModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    NewSharePlanMnpValidateCustomerPageComponent,
    NewSharePlanMnpValidateCustomerIdCardPageComponent,
    NewSharePlanMnpValidateCustomerKeyInPageComponent,
    NewSharePlanMnpCustomerInfoPageComponent,
    NewSharePlanMnpIdCardCapturePageComponent,
    NewSharePlanMnpFaceCapturePageComponent,
    NewSharePlanMnpFaceComparePageComponent,
    NewSharePlanMnpFaceConfirmPageComponent,
    NewSharePlanMnpSelectNumberPageComponent,
    NewSharePlanMnpVerifyInstantSimPageComponent,
    NewSharePlanMnpVerifyByPatternPageComponent,
    NewSharePlanMnpSelectPackageMasterPageComponent,
    NewSharePlanMnpNetworkTypePageComponent,
    NewSharePlanMnpSelectPackageMemberPageComponent,
    NewSharePlanMnpConfirmUserInformationPageComponent,
    NewSharePlanMnpEbillingAddressPageComponent,
    NewSharePlanMnpEbillingPageComponent,
    NewSharePlanMnpSummaryPageComponent,
    NewSharePlanMnpAgreementSignPageComponent,
    NewSharePlanMnpPersoSimNewPageComponent,
    NewSharePlanMnpPersoSimMnpPageComponent,
    NewSharePlanMnpResultPageComponent,
    BillingInfoComponent,
    ConfirmCustomerInfoComponent,
    PrinterComponent,
    ResizeImageComponent,
    SummarySellerCodeComponent
  ]
})
export class NewSharePlanMnpModule { }
