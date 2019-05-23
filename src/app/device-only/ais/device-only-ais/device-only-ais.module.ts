import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './containers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisQueuePageComponent } from './containers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './containers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAisCheckoutPaymentPageComponent } from './containers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisSummaryPageComponent } from './containers/device-only-ais-summary-page/device-only-ais-summary-page.component';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './containers/device-only-ais-qr-code-summaray-page/device-only-ais-qr-code-summaray-page.component';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './containers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './containers/device-only-ais-checkout-payment-qr-code-page/device-only-ais-checkout-payment-qr-code-page.component';
import { DeviceOnlyAisKeyInQueuePageComponent } from './containers/device-only-ais-key-in-queue-page/device-only-ais-key-in-queue-page.component';
import { DeviceOnlyReadCardComponent } from './components/device-only-read-card/device-only-read-card.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MobileCareComponent } from './components/mobile-care/mobile-care.component';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ReceiptInformationComponent } from './components/receipt-information/receipt-information.component';
import { BillingAddressService } from './services/billing-address.service';
import { BillingAddressComponent } from './components/billing-address/billing-address.component';

import { SummaryOrderDetailComponent } from './components/summary-order-detail/summary-order-detail.component';
import { SummaryProductAndServiceComponent } from './components/summary-product-and-service/summary-product-and-service.component';
import { SummaryPaymentDetailComponent } from './components/summary-payment-detail/summary-payment-detail.component';
import { SummarySellerCodeComponent } from './components/summary-seller-code/summary-seller-code.component';
import { CreateOrderService } from './services/create-order.service';
import { CustomerInformationService } from './services/customer-information.service';
import { SellerService } from 'src/app/device-only/ais/device-only-ais/services/seller.service';
import { ShoppingCartDetailComponent } from './components/shopping-cart-detail/shopping-cart-detail.component';
import { DeviceOnlyAutoGetQueuePageComponent } from './containers/device-only-ais-auto-get-queue-page/device-only-ais-auto-get-queue-page.component';
import { DeviceOnlyAisQrCodeKeyInQueuePageComponent } from './containers/device-only-ais-qr-code-key-in-queue-page/device-only-ais-qr-code-key-in-queue-page.component';
import { DeviceOnlyAisResultQueuePageComponent } from './containers/device-only-ais-result-queue-page/device-only-ais-result-queue-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceOnlyAisRoutingModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyAisSelectMobileCarePageComponent,
    DeviceOnlyAisQueuePageComponent,
    DeviceOnlyAisQrCodeQueuePageComponent,
    DeviceOnlyAisCheckoutPaymentPageComponent,
    DeviceOnlyAisSummaryPageComponent,
    DeviceOnlyAisQrCodeSummarayPageComponent,
    DeviceOnlyAisQrCodeGeneratePageComponent,
    DeviceOnlyAisCheckoutPaymentQrCodePageComponent,
    DeviceOnlyAisKeyInQueuePageComponent,
    DeviceOnlyReadCardComponent,
    MobileCareComponent,
    ReceiptInformationComponent,
    BillingAddressComponent,
    SummaryOrderDetailComponent,
    SummaryProductAndServiceComponent,
    SummaryPaymentDetailComponent,
    SummarySellerCodeComponent,
    ShoppingCartDetailComponent,
    DeviceOnlyAutoGetQueuePageComponent,
    DeviceOnlyAisQrCodeKeyInQueuePageComponent,
    DeviceOnlyAisResultQueuePageComponent,
  ],
  providers: [
    BillingAddressService,
    CreateOrderService,
    CustomerInformationService,
    SellerService
  ]
})
export class DeviceOnlyAisModule { }
