import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
// containers
import { DeviceOnlyAisCheckoutPaymentPageComponent } from './containers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './containers/device-only-ais-checkout-payment-qr-code-page/device-only-ais-checkout-payment-qr-code-page.component';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './containers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
import { DeviceOnlyAisQrCodeKeyInQueuePageComponent } from './containers/device-only-ais-qr-code-key-in-queue-page/device-only-ais-qr-code-key-in-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './containers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './containers/device-only-ais-qr-code-summaray-page/device-only-ais-qr-code-summaray-page.component';
import { DeviceOnlyAisQueuePageComponent } from './containers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisResultQueuePageComponent } from './containers/device-only-ais-result-queue-page/device-only-ais-result-queue-page.component';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './containers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAisSummaryPageComponent } from './containers/device-only-ais-summary-page/device-only-ais-summary-page.component';
// component
import { BillingAddressComponent } from '../../components/billing-address/billing-address.component';
import { DeviceOnlyReadCardComponent } from '../../components/device-only-read-card/device-only-read-card.component';
import { MobileCareComponent } from '../../components/mobile-care/mobile-care.component';
import { ReceiptInformationComponent } from '../../components/receipt-information/receipt-information.component';
import { ShoppingCartDetailComponent } from '../../components/shopping-cart-detail/shopping-cart-detail.component';
import { SummaryOrderDetailComponent } from '../../components/summary-order-detail/summary-order-detail.component';
import { SummaryPaymentDetailComponent } from '../../components/summary-payment-detail/summary-payment-detail.component';
import { SummaryProductAndServiceComponent } from '../../components/summary-product-and-service/summary-product-and-service.component';
import { SummarySellerCodeComponent } from '../../components/summary-seller-code/summary-seller-code.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyAisRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TranslateModule,
    MyChannelSharedLibsModule
  ],
  declarations: [
    DeviceOnlyAisCheckoutPaymentPageComponent,
    DeviceOnlyAisCheckoutPaymentQrCodePageComponent,
    DeviceOnlyAisQrCodeGeneratePageComponent,
    DeviceOnlyAisQrCodeKeyInQueuePageComponent,
    DeviceOnlyAisQrCodeQueuePageComponent,
    DeviceOnlyAisQrCodeSummarayPageComponent,
    DeviceOnlyAisQueuePageComponent,
    DeviceOnlyAisResultQueuePageComponent,
    DeviceOnlyAisSelectMobileCarePageComponent,
    DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyAisSummaryPageComponent,

    BillingAddressComponent,
    DeviceOnlyReadCardComponent,
    MobileCareComponent,
    ReceiptInformationComponent,
    ShoppingCartDetailComponent,
    SummaryOrderDetailComponent,
    SummaryPaymentDetailComponent,
    SummaryProductAndServiceComponent,
    SummarySellerCodeComponent
  ],
  providers: []
})
export class DeviceOnlyAisModule { }
