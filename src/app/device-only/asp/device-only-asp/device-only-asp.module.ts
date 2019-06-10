import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAspRoutingModule } from './device-only-asp-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
// containers
import { DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-asp-select-payment-and-receipt-information-page/device-only-asp-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAspSelectMobileCarePageComponent } from './containers/device-only-asp-select-mobile-care-page/device-only-asp-select-mobile-care-page.component';
import { DeviceOnlyAspQueuePageComponent } from './containers/device-only-asp-queue-page/device-only-asp-queue-page.component';
import { DeviceOnlyAspQrCodeQueuePageComponent } from './containers/device-only-asp-qr-code-queue-page/device-only-asp-qr-code-queue-page.component';
import { DeviceOnlyAspCheckoutPaymentPageComponent } from './containers/device-only-asp-checkout-payment-page/device-only-asp-checkout-payment-page.component';
import { DeviceOnlyAspSummaryPageComponent } from './containers/device-only-asp-summary-page/device-only-asp-summary-page.component';
import { DeviceOnlyAspQrCodeSummaryPageComponent } from './containers/device-only-asp-qr-code-summary-page/device-only-asp-qr-code-summary-page.component';
import { DeviceOnlyAspQrCodeGeneratePageComponent } from './containers/device-only-asp-qr-code-generate-page/device-only-asp-qr-code-generate-page.component';
import { DeviceOnlyAspCheckoutPaymentQrCodePageComponent } from './containers/device-only-asp-checkout-payment-qr-code-page/device-only-asp-checkout-payment-qr-code-page.component';
import { DeviceOnlyAspQrCodeKeyInQueuePageComponent } from './containers/device-only-asp-qr-code-key-in-queue-page/device-only-asp-qr-code-key-in-queue-page.component';
import { DeviceOnlyAspResultQueuePageComponent } from './containers/device-only-asp-result-queue-page/device-only-asp-result-queue-page.component';
// component
import { BillingAddressComponent } from '../../components/billing-address/billing-address.component';
import { DeviceOnlyReadCardComponent } from '../../components/device-only-read-card/device-only-read-card.component';
import { ReceiptInformationComponent } from '../../components/receipt-information/receipt-information.component';
import { ShoppingCartDetailComponent } from '../../components/shopping-cart-detail/shopping-cart-detail.component';
import { SummaryOrderDetailComponent } from '../../components/summary-order-detail/summary-order-detail.component';
import { SummaryPaymentDetailComponent } from '../../components/summary-payment-detail/summary-payment-detail.component';
import { SummaryProductAndServiceComponent } from '../../components/summary-product-and-service/summary-product-and-service.component';
import { SummarySellerCodeComponent } from '../../components/summary-seller-code/summary-seller-code.component';
import { MobileCareComponent } from '../../components/mobile-care/mobile-care.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyAspRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TranslateModule,
    MyChannelSharedLibsModule
  ],
  declarations: [
    DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyAspSelectMobileCarePageComponent,
    DeviceOnlyAspQueuePageComponent,
    DeviceOnlyAspQrCodeQueuePageComponent,
    DeviceOnlyAspCheckoutPaymentPageComponent,
    DeviceOnlyAspSummaryPageComponent,
    DeviceOnlyAspQrCodeSummaryPageComponent,
    DeviceOnlyAspQrCodeGeneratePageComponent,
    DeviceOnlyAspCheckoutPaymentQrCodePageComponent,
    DeviceOnlyAspQrCodeKeyInQueuePageComponent,
    DeviceOnlyAspResultQueuePageComponent,

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
export class DeviceOnlyAspModule { }
