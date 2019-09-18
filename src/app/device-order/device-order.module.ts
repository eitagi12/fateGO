import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { IdCardPipe } from 'mychannel-shared-libs';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceOrderRoutingModule } from './device-order-routing.module';
import { DeviceOrderComponent } from './device-order.component';
import { PromotionShelveService } from './services/promotion-shelve.service';
import { MobileCareService } from './services/mobile-care.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { PrivilegeService } from './services/privilege.service';
import { CustomerInfoService } from './services/customer-info.service';
import { QueuePageService } from './services/queue-page.service';
import { QrCodePageService } from './services/qr-code-page.service';
import { SummaryPageService } from './services/summary-page.service';
import { NewRegisterMnpAggregatePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-aggregate-page/new-register-mnp-aggregate-page.component';
import { NewRegisterMnpAgreementSignPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-agreement-sign-page/new-register-mnp-agreement-sign-page.component';
import { NewRegisterMnpConfirmUserInformationPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-confirm-user-information-page/new-register-mnp-confirm-user-information-page.component';
import { NewRegisterMnpCustomerInfoPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-customer-info-page/new-register-mnp-customer-info-page.component';
import { NewRegisterMnpEbillingAddressPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-ebilling-address-page/new-register-mnp-ebilling-address-page.component';
import { NewRegisterMnpEbillingPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-ebilling-page/new-register-mnp-ebilling-page.component';
import { NewRegisterMnpEcontactPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-econtact-page/new-register-mnp-econtact-page.component';
import { NewRegisterMnpEffectiveStartDatePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-effective-start-date-page/new-register-mnp-effective-start-date-page.component';
import { NewRegisterMnpEligibleMobilePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-eligible-mobile-page/new-register-mnp-eligible-mobile-page.component';
import { NewRegisterMnpFaceCapturePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-face-capture-page/new-register-mnp-face-capture-page.component';
import { NewRegisterMnpFaceComparePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-face-compare-page/new-register-mnp-face-compare-page.component';
import { NewRegisterMnpFaceConfirmPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-face-confirm-page/new-register-mnp-face-confirm-page.component';
import { NewRegisterMnpMobileCareAvaliblePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-mobile-care-avalible-page/new-register-mnp-mobile-care-avalible-page.component';
import { NewRegisterMnpMobileCarePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-mobile-care-page/new-register-mnp-mobile-care-page.component';
import { NewRegisterMnpMobileDetailPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-mobile-detail-page/new-register-mnp-mobile-detail-page.component';
import { NewRegisterMnpPaymentDetailPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-payment-detail-page/new-register-mnp-payment-detail-page.component';
import { NewRegisterMnpQrCodeGeneratorPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-qr-code-generator-page/new-register-mnp-qr-code-generator-page.component';
import { NewRegisterMnpQrCodeQueuePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-qr-code-queue-page/new-register-mnp-qr-code-queue-page.component';
import { NewRegisterMnpQrCodeResultPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-qr-code-result-page/new-register-mnp-qr-code-result-page.component';
import { NewRegisterMnpQrCodeSummaryPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-qr-code-summary-page/new-register-mnp-qr-code-summary-page.component';
import { NewRegisterMnpQueuePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-queue-page/new-register-mnp-queue-page.component';
import { NewRegisterMnpResultPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-result-page/new-register-mnp-result-page.component';
import { NewRegisterMnpSelectPackageOntopPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-select-package-ontop-page/new-register-mnp-select-package-ontop-page.component';
import { NewRegisterMnpSelectPackagePageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-select-package-page/new-register-mnp-select-package-page.component';
import { NewRegisterMnpSummaryPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-summary-page/new-register-mnp-summary-page.component';
import { NewRegisterMnpValidateCustomerIdCardPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-validate-customer-id-card-page/new-register-mnp-validate-customer-id-card-page.component';
import { NewRegisterMnpValidateCustomerKeyInPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-validate-customer-key-in-page/new-register-mnp-validate-customer-key-in-page.component';
import { NewRegisterMnpValidateCustomerPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-validate-customer-page/new-register-mnp-validate-customer-page.component';
import { NewRegisterMnpPersoSimPageComponent } from './ais/device-order-ais-share-plan/new-register-mnp/containers/new-register-mnp-perso-sim-page/new-register-mnp-perso-sim-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderRoutingModule,
    TranslateModule
  ],
  providers: [
    PromotionShelveService,
    MobileCareService,
    ShoppingCartService,
    PrivilegeService,
    CustomerInfoService,
    QueuePageService,
    QrCodePageService,
    SummaryPageService,
    IdCardPipe,
    DecimalPipe
  ],
  declarations: [
    DeviceOrderComponent,
    NewRegisterMnpAggregatePageComponent,
    NewRegisterMnpAgreementSignPageComponent,
    NewRegisterMnpConfirmUserInformationPageComponent,
    NewRegisterMnpCustomerInfoPageComponent,
    NewRegisterMnpEbillingAddressPageComponent,
    NewRegisterMnpEbillingPageComponent,
    NewRegisterMnpEcontactPageComponent,
    NewRegisterMnpEffectiveStartDatePageComponent,
    NewRegisterMnpEligibleMobilePageComponent,
    NewRegisterMnpFaceCapturePageComponent,
    NewRegisterMnpFaceComparePageComponent,
    NewRegisterMnpFaceConfirmPageComponent,
    NewRegisterMnpMobileCareAvaliblePageComponent,
    NewRegisterMnpMobileCarePageComponent,
    NewRegisterMnpMobileDetailPageComponent,
    NewRegisterMnpPaymentDetailPageComponent,
    NewRegisterMnpQrCodeGeneratorPageComponent,
    NewRegisterMnpQrCodeQueuePageComponent,
    NewRegisterMnpQrCodeResultPageComponent,
    NewRegisterMnpQrCodeSummaryPageComponent,
    NewRegisterMnpQueuePageComponent,
    NewRegisterMnpResultPageComponent,
    NewRegisterMnpSelectPackageOntopPageComponent,
    NewRegisterMnpSelectPackagePageComponent,
    NewRegisterMnpSummaryPageComponent,
    NewRegisterMnpValidateCustomerIdCardPageComponent,
    NewRegisterMnpValidateCustomerKeyInPageComponent,
    NewRegisterMnpValidateCustomerPageComponent,
    NewRegisterMnpPersoSimPageComponent]
})
export class DeviceOrderModule { }
