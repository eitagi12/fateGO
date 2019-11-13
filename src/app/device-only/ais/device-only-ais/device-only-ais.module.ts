import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TabsModule} from 'ngx-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOnlySharedModule } from '../../shared/shared.module';
// containers
import { DeviceOnlyAisCheckoutPaymentPageComponent } from './containers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './containers/device-only-ais-checkout-payment-qr-code-page/device-only-ais-checkout-payment-qr-code-page.component';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './containers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
import { DeviceOnlyAisQrCodeKeyInQueuePageComponent } from './containers/device-only-ais-qr-code-key-in-queue-page/device-only-ais-qr-code-key-in-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './containers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { DeviceOnlyAisQrCodeSummaryPageComponent } from './containers/device-only-ais-qr-code-summary-page/device-only-ais-qr-code-summary-page.component';
import { DeviceOnlyAisQueuePageComponent } from './containers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisResultQueuePageComponent } from './containers/device-only-ais-result-queue-page/device-only-ais-result-queue-page.component';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './containers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAisSummaryPageComponent } from './containers/device-only-ais-summary-page/device-only-ais-summary-page.component';
import { DeviceOnlyAisOmiseGeneratorPageComponent } from './containers/device-only-ais-omise-generator-page/device-only-ais-omise-generator-page.component';
import { DeviceOnlyAisOmiseQueuePageComponent } from './containers/device-only-ais-omise-queue-page/device-only-ais-omise-queue-page.component';
import { DeviceOnlyAisOmiseResultPageComponent } from './containers/device-only-ais-omise-result-page/device-only-ais-omise-result-page.component';
import { DeviceOnlyAisOmiseSummaryPageComponent } from './containers/device-only-ais-omise-summary-page/device-only-ais-omise-summary-page.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    TranslateModule,
    DeviceOnlyAisRoutingModule,
    MyChannelSharedLibsModule,
    DeviceOnlySharedModule
  ],
  declarations: [
    DeviceOnlyAisCheckoutPaymentPageComponent,
    DeviceOnlyAisCheckoutPaymentQrCodePageComponent,
    DeviceOnlyAisQrCodeGeneratePageComponent,
    DeviceOnlyAisQrCodeKeyInQueuePageComponent,
    DeviceOnlyAisQrCodeQueuePageComponent,
    DeviceOnlyAisQrCodeSummaryPageComponent,
    DeviceOnlyAisQueuePageComponent,
    DeviceOnlyAisResultQueuePageComponent,
    DeviceOnlyAisSelectMobileCarePageComponent,
    DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyAisSummaryPageComponent,
    DeviceOnlyAisOmiseGeneratorPageComponent,
    DeviceOnlyAisOmiseQueuePageComponent,
    DeviceOnlyAisOmiseResultPageComponent,
    DeviceOnlyAisOmiseSummaryPageComponent
  ],
  providers: []
})
export class DeviceOnlyAisModule { }
