import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewRegisterMnpValidateCustomerPageComponent } from './new-register-mnp/containers/new-register-mnp-validate-customer-page/new-register-mnp-validate-customer-page.component';
import { NewRegisterMnpValidateCustomerKeyInPageComponent } from './new-register-mnp/containers/new-register-mnp-validate-customer-key-in-page/new-register-mnp-validate-customer-key-in-page.component';
import { NewRegisterMnpValidateCustomerIdCardPageComponent } from './new-register-mnp/containers/new-register-mnp-validate-customer-id-card-page/new-register-mnp-validate-customer-id-card-page.component';
import { NewRegisterMnpPaymentDetailPageComponent } from './new-register-mnp/containers/new-register-mnp-payment-detail-page/new-register-mnp-payment-detail-page.component';
import { NewRegisterMnpCustomerInfoPageComponent } from './new-register-mnp/containers/new-register-mnp-customer-info-page/new-register-mnp-customer-info-page.component';
import { NewRegisterMnpSelectPackagePageComponent } from './new-register-mnp/containers/new-register-mnp-select-package-page/new-register-mnp-select-package-page.component';
import { NewRegisterMnpConfirmUserInformationPageComponent } from './new-register-mnp/containers/new-register-mnp-confirm-user-information-page/new-register-mnp-confirm-user-information-page.component';
import { NewRegisterMnpEbillingAddressPageComponent } from './new-register-mnp/containers/new-register-mnp-ebilling-address-page/new-register-mnp-ebilling-address-page.component';
import { NewRegisterMnpEbillingPageComponent } from './new-register-mnp/containers/new-register-mnp-ebilling-page/new-register-mnp-ebilling-page.component';
import { NewRegisterMnpMobileCarePageComponent } from './new-register-mnp/containers/new-register-mnp-mobile-care-page/new-register-mnp-mobile-care-page.component';
import { NewRegisterMnpMobileCareAvaliblePageComponent } from './new-register-mnp/containers/new-register-mnp-mobile-care-avalible-page/new-register-mnp-mobile-care-avalible-page.component';
import { NewRegisterMnpSummaryPageComponent } from './new-register-mnp/containers/new-register-mnp-summary-page/new-register-mnp-summary-page.component';
import { NewRegisterMnpEcontactPageComponent } from './new-register-mnp/containers/new-register-mnp-econtact-page/new-register-mnp-econtact-page.component';
import { NewRegisterMnpAgreementSignPageComponent } from './new-register-mnp/containers/new-register-mnp-agreement-sign-page/new-register-mnp-agreement-sign-page.component';
import { NewRegisterMnpFaceCapturePageComponent } from './new-register-mnp/containers/new-register-mnp-face-capture-page/new-register-mnp-face-capture-page.component';
import { NewRegisterMnpFaceComparePageComponent } from './new-register-mnp/containers/new-register-mnp-face-compare-page/new-register-mnp-face-compare-page.component';
import { NewRegisterMnpFaceConfirmPageComponent } from './new-register-mnp/containers/new-register-mnp-face-confirm-page/new-register-mnp-face-confirm-page.component';
import { NewRegisterMnpAggregatePageComponent } from './new-register-mnp/containers/new-register-mnp-aggregate-page/new-register-mnp-aggregate-page.component';
import { NewRegisterMnpQueuePageComponent } from './new-register-mnp/containers/new-register-mnp-queue-page/new-register-mnp-queue-page.component';
import { NewRegisterMnpResultPageComponent } from './new-register-mnp/containers/new-register-mnp-result-page/new-register-mnp-result-page.component';
import { NewRegisterMnpQrCodeSummaryPageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-summary-page/new-register-mnp-qr-code-summary-page.component';
import { NewRegisterMnpQrCodeQueuePageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-queue-page/new-register-mnp-qr-code-queue-page.component';
import { NewRegisterMnpQrCodeGeneratorPageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-generator-page/new-register-mnp-qr-code-generator-page.component';
import { NewRegisterMnpQrCodeResultPageComponent } from './new-register-mnp/containers/new-register-mnp-qr-code-result-page/new-register-mnp-qr-code-result-page.component';
import { NewRegisterMnpEligibleMobilePageComponent } from './new-register-mnp/containers/new-register-mnp-eligible-mobile-page/new-register-mnp-eligible-mobile-page.component';
import { NewRegisterMnpMobileDetailPageComponent } from './new-register-mnp/containers/new-register-mnp-mobile-detail-page/new-register-mnp-mobile-detail-page.component';
import { NewRegisterMnpEffectiveStartDatePageComponent } from './new-register-mnp/containers/new-register-mnp-effective-start-date-page/new-register-mnp-effective-start-date-page.component';
import { NewRegisterMnpSelectPackageOntopPageComponent } from './new-register-mnp/containers/new-register-mnp-select-package-ontop-page/new-register-mnp-select-package-ontop-page.component';
import { NewRegisterMnpSelectNumberPageComponent } from './new-register-mnp/containers/new-register-mnp-select-number-page/new-register-mnp-select-number-page.component';

const routes: Routes = [
    { path: 'validate-customer', component: NewRegisterMnpValidateCustomerPageComponent },
    { path: 'validate-customer-key-in', component: NewRegisterMnpValidateCustomerKeyInPageComponent },
    { path: 'validate-customer-id-card', component: NewRegisterMnpValidateCustomerIdCardPageComponent },
    { path: 'payment-detail', component: NewRegisterMnpPaymentDetailPageComponent },
    { path: 'customer-info', component: NewRegisterMnpCustomerInfoPageComponent },
    { path: 'select-package', component: NewRegisterMnpSelectPackagePageComponent },
    { path: 'confirm-user-information', component: NewRegisterMnpConfirmUserInformationPageComponent },
    { path: 'ebilling-address', component: NewRegisterMnpEbillingAddressPageComponent },
    { path: 'ebilling', component: NewRegisterMnpEbillingPageComponent },
    { path: 'mobile-care', component: NewRegisterMnpMobileCarePageComponent },
    { path: 'mobile-care-avalible', component: NewRegisterMnpMobileCareAvaliblePageComponent },
    { path: 'summary', component: NewRegisterMnpSummaryPageComponent },
    { path: 'econtact', component: NewRegisterMnpEcontactPageComponent },
    { path: 'agreement-sign', component: NewRegisterMnpAgreementSignPageComponent },
    { path: 'face-capture', component: NewRegisterMnpFaceCapturePageComponent },
    { path: 'face-compare', component: NewRegisterMnpFaceComparePageComponent },
    { path: 'face-confirm', component: NewRegisterMnpFaceConfirmPageComponent },
    { path: 'aggregate', component: NewRegisterMnpAggregatePageComponent },
    { path: 'queue', component: NewRegisterMnpQueuePageComponent },
    { path: 'result', component: NewRegisterMnpResultPageComponent },
    { path: 'qr-code-summary', component: NewRegisterMnpQrCodeSummaryPageComponent },
    { path: 'qr-code-queue', component: NewRegisterMnpQrCodeQueuePageComponent },
    { path: 'qr-code-generator', component: NewRegisterMnpQrCodeGeneratorPageComponent },
    { path: 'qr-code-result', component: NewRegisterMnpQrCodeResultPageComponent },
    { path: 'eligible-mobile', component: NewRegisterMnpEligibleMobilePageComponent },
    { path: 'mobile-detail', component: NewRegisterMnpMobileDetailPageComponent },
    { path: 'effective-start-date', component: NewRegisterMnpEffectiveStartDatePageComponent },
    { path: 'select-package-ontop', component: NewRegisterMnpSelectPackageOntopPageComponent },
    { path: 'select-number', component: NewRegisterMnpSelectNumberPageComponent },
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DeviceOrderNewRegisterMnpRoutingModule { }
