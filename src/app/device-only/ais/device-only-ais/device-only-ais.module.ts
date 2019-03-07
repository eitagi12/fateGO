import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './containers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisMobileCareAvaliablePageComponent } from './containers/device-only-ais-mobile-care-avaliable-page/device-only-ais-mobile-care-avaliable-page.component';
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
    DeviceOnlyAisMobileCareAvaliablePageComponent,
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
    ReceiptInformationComponent
  ],
  providers: [BillingAddressService]
})
export class DeviceOnlyAisModule { }
