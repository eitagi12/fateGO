import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';
import { DeviceOrderAisExistingGadgetCustomerInfoPageComponent } from './containers/device-order-ais-existing-gadget-customer-info-page/device-order-ais-existing-gadget-customer-info-page.component';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from './containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';
import { DeviceOrderAisExistingGadgetPaymentDetailPageComponent } from './containers/device-order-ais-existing-gadget-payment-detail-page/device-order-ais-existing-gadget-payment-detail-page.component';
import { DeviceOrderAisExistingGadgetValidateIdentifyPageComponent } from './containers/device-order-ais-existing-gadget-validate-identify-page/device-order-ais-existing-gadget-validate-identify-page.component';
import { DeviceOrderAisExistingGadgetSummaryPageComponent } from './containers/device-order-ais-existing-gadget-summary-page/device-order-ais-existing-gadget-summary-page.component';

import { DeviceOrderAisExistingGadgetQueuePageComponent } from './containers/device-order-ais-existing-gadget-queue-page/device-order-ais-existing-gadget-queue-page.component';
import { DeviceOrderAisExistingGadgetResultPageComponent } from './containers/device-order-ais-existing-gadget-result-page/device-order-ais-existing-gadget-result-page.component';
import { DeviceOrderAisExistingGadgetEligibleMobilePageComponent } from './containers/device-order-ais-existing-gadget-eligible-mobile-page/device-order-ais-existing-gadget-eligible-mobile-page.component';
import { DeviceOrderAisExistingGadgetAgreementSignPageComponent } from './containers/device-order-ais-existing-gadget-agreement-sign-page/device-order-ais-existing-gadget-agreement-sign-page.component';
import { DeviceOrderAisExistingGadgetEcontractPageComponent } from './containers/device-order-ais-existing-gadget-econtract-page/device-order-ais-existing-gadget-econtract-page.component';
import { DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-id-card-page/device-order-ais-existing-gadget-validate-customer-id-card-page.component';
import { DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent } from './containers/device-order-ais-existing-gadget-validate-identify-id-card-page/device-order-ais-existing-gadget-validate-identify-id-card-page.component';
import { DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent } from './containers/device-order-ais-existing-gadget-qr-code-summary-page/device-order-ais-existing-gadget-qr-code-summary-page.component';
import { DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent } from './containers/device-order-ais-existing-gadget-qr-code-generator-page/device-order-ais-existing-gadget-qr-code-generator-page.component';
import { DeviceOrderAisExistingGadgetQrCodeQueuePageComponent } from './containers/device-order-ais-existing-gadget-qr-code-queue-page/device-order-ais-existing-gadget-qr-code-queue-page.component';
import { DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent } from './containers/device-order-ais-existing-gadget-effective-start-date-page/device-order-ais-existing-gadget-effective-start-date-page.component';
import { DeviceOrderAisExistingGadgetSelectPackagePageComponent } from './containers/device-order-ais-existing-gadget-select-package-page/device-order-ais-existing-gadget-select-package-page.component';
import { DeviceOrderAisExistingGadgetNonPackagePageComponent } from './containers/device-order-ais-existing-gadget-non-package-page/device-order-ais-existing-gadget-non-package-page.component';
import { DeviceOrderAisExistingGadgetChangePackagePageComponent } from './containers/device-order-ais-existing-gadget-change-package-page/device-order-ais-existing-gadget-change-package-page.component';
import { DeviceOrderAisExistingGadgetAggregatePageComponent } from 'src/app/device-order/ais/device-order-ais-existing-gadget/containers/device-order-ais-existing-gadget-aggregate-page/device-order-ais-existing-gadget-aggregate-page.component';
import { DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent } from './containers/device-order-ais-existing-gadget-select-package-ontop-page/device-order-ais-existing-gadget-select-package-ontop-page.component';
import { DeviceOrderAisExistingGadgetQrCodeResultPageComponent } from './containers/device-order-ais-existing-gadget-qr-code-result-page/device-order-ais-existing-gadget-qr-code-result-page.component';
import { DeviceOrderAisExistingGadgetEshippingAddressPageComponent } from './containers/device-order-ais-existing-gadget-eshipping-address-page/device-order-ais-existing-gadget-eshipping-address-page.component';
import { DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent } from './containers/device-order-ais-existing-gadget-omise-generator-page/device-order-ais-existing-gadget-omise-generator-page.component';
import { DeviceOrderAisExistingGadgetOmiseQueuePageComponent } from './containers/device-order-ais-existing-gadget-omise-queue-page/device-order-ais-existing-gadget-omise-queue-page.component';
import { DeviceOrderAisExistingGadgetOmiseSummaryPageComponent } from './containers/device-order-ais-existing-gadget-omise-summary-page/device-order-ais-existing-gadget-omise-summary-page.component';
import { PaymentLineShopComponent } from 'src/app/device-only/components/payment-line-shop/payment-line-shop.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingGadgetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    DeviceOrderAisExistingGadgetMobileDetailPageComponent,
    DeviceOrderAisExistingGadgetValidateCustomerPageComponent,
    DeviceOrderAisExistingGadgetPaymentDetailPageComponent,
    DeviceOrderAisExistingGadgetCustomerInfoPageComponent,
    DeviceOrderAisExistingGadgetValidateIdentifyPageComponent,
    DeviceOrderAisExistingGadgetSummaryPageComponent,
    DeviceOrderAisExistingGadgetAggregatePageComponent,
    DeviceOrderAisExistingGadgetQueuePageComponent,
    DeviceOrderAisExistingGadgetResultPageComponent,
    DeviceOrderAisExistingGadgetEligibleMobilePageComponent,
    DeviceOrderAisExistingGadgetAgreementSignPageComponent,
    DeviceOrderAisExistingGadgetEcontractPageComponent,
    DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent,
    DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent,
    DeviceOrderAisExistingGadgetQrCodeSummaryPageComponent,
    DeviceOrderAisExistingGadgetQrCodeGeneratorPageComponent,
    DeviceOrderAisExistingGadgetQrCodeQueuePageComponent,
    DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent,
    DeviceOrderAisExistingGadgetSelectPackagePageComponent,
    DeviceOrderAisExistingGadgetNonPackagePageComponent,
    DeviceOrderAisExistingGadgetChangePackagePageComponent,
    DeviceOrderAisExistingGadgetSelectPackageOntopPageComponent,
    DeviceOrderAisExistingGadgetQrCodeResultPageComponent,
    DeviceOrderAisExistingGadgetEshippingAddressPageComponent,
    DeviceOrderAisExistingGadgetOmiseGeneratorPageComponent,
    DeviceOrderAisExistingGadgetOmiseQueuePageComponent,
    DeviceOrderAisExistingGadgetOmiseSummaryPageComponent,
    PaymentLineShopComponent,
  ]
})
export class DeviceOrderAisExistingGadgetModule { }
