import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyKioskCheckoutPaymentPageComponent } from './containers/device-only-kiosk-checkout-payment-page/device-only-kiosk-checkout-payment-page.component';
import { DeviceOnlyKioskCheckoutPaymentQrCodePageComponent } from './containers/device-only-kiosk-checkout-payment-qr-code-page/device-only-kiosk-checkout-payment-qr-code-page.component';
import { DeviceOnlyKioskQrCodeGenaratePageComponent } from './containers/device-only-kiosk-qr-code-genarate-page/device-only-kiosk-qr-code-genarate-page.component';
import { DeviceOnlyKioskQrCodeKeyInQueuePageComponent } from './containers/device-only-kiosk-qr-code-key-in-queue-page/device-only-kiosk-qr-code-key-in-queue-page.component';
import { DeviceOnlyKioskQrCodeQueuePageComponent } from './containers/device-only-kiosk-qr-code-queue-page/device-only-kiosk-qr-code-queue-page.component';
import { DeviceOnlyKioskResultQueuePageComponent } from './containers/device-only-kiosk-result-queue-page/device-only-kiosk-result-queue-page.component';
import { DeviceOnlyKioskSelectMobileCarePageComponent } from './containers/device-only-kiosk-select-mobile-care-page/device-only-kiosk-select-mobile-care-page.component';
import { DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-kiosk-select-payment-and-receipt-information-page/device-only-kiosk-select-payment-and-receipt-information-page.component';
import { DeviceOnlyKioskSummaryPageComponent } from './containers/device-only-kiosk-summary-page/device-only-kiosk-summary-page.component';
import { DeviceOnlyKioskQrCodeSummaryPageComponent } from './containers/device-only-kiosk-qr-code-summary-page/device-only-kiosk-qr-code-summary-page.component';
import { DeviceOnlyKioskQueuePageComponent } from './containers/device-only-kiosk-queue-page/device-only-kiosk-queue-page.component';
import { TranslateModule } from '@ngx-translate/core';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOnlyKioskRoutingModule } from './device-only-kiosk-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BillingAddressComponent } from '../../components/billing-address/billing-address.component';
import { SummaryProductAndServiceComponent } from '../../components/summary-product-and-service/summary-product-and-service.component';
import { DeviceOnlyReadCardComponent } from '../../components/device-only-read-card/device-only-read-card.component';
import { ReceiptInformationComponent } from '../../components/receipt-information/receipt-information.component';
import { ShoppingCartDetailComponent } from '../../components/shopping-cart-detail/shopping-cart-detail.component';
import { SummaryOrderDetailComponent } from '../../components/summary-order-detail/summary-order-detail.component';
import { SummaryPaymentDetailComponent } from '../../components/summary-payment-detail/summary-payment-detail.component';
import { SummarySellerCodeComponent } from '../../components/summary-seller-code/summary-seller-code.component';
import { MobileCareComponent } from '../../components/mobile-care/mobile-care.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeviceOnlyKioskRoutingModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    TranslateModule,
  ],
  declarations:
  [
    BillingAddressComponent,
    DeviceOnlyReadCardComponent,
    MobileCareComponent,
    ReceiptInformationComponent,
    ShoppingCartDetailComponent,
    SummaryOrderDetailComponent,
    SummaryPaymentDetailComponent,
    SummarySellerCodeComponent,
    SummaryProductAndServiceComponent,
    DeviceOnlyKioskCheckoutPaymentPageComponent,
    DeviceOnlyKioskCheckoutPaymentQrCodePageComponent,
    DeviceOnlyKioskQrCodeGenaratePageComponent,
    DeviceOnlyKioskQrCodeKeyInQueuePageComponent,
    DeviceOnlyKioskQrCodeQueuePageComponent,
    DeviceOnlyKioskResultQueuePageComponent,
    DeviceOnlyKioskSelectMobileCarePageComponent,
    DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyKioskSummaryPageComponent,
    DeviceOnlyKioskQrCodeSummaryPageComponent,
    DeviceOnlyKioskQueuePageComponent,
  ]
})
export class DeviceOnlyKioskModule { }
