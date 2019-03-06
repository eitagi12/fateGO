import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './contrainers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisMobileCareAvaliablePageComponent } from './contrainers/device-only-ais-mobile-care-avaliable-page/device-only-ais-mobile-care-avaliable-page.component';
import { DeviceOnlyAisQueuePageComponent } from './contrainers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './contrainers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './contrainers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAisCheckoutPaymentPageComponent } from './contrainers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisSummaryPageComponent } from './contrainers/device-only-ais-summary-page/device-only-ais-summary-page.component';
import { ProcessingStepComponent } from './components/processing-step/processing-step.component';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './contrainers/device-only-ais-qr-code-summaray-page/device-only-ais-qr-code-summaray-page.component';


@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyAisRoutingModule,
    MyChannelSharedLibsModule
  ],
  declarations: [
    DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent,
    DeviceOnlyAisSelectMobileCarePageComponent,
    DeviceOnlyAisMobileCareAvaliablePageComponent,
    DeviceOnlyAisQueuePageComponent,
    DeviceOnlyAisQrCodeQueuePageComponent,
    DeviceOnlyAisCheckoutPaymentPageComponent,
    DeviceOnlyAisSummaryPageComponent,
    ProcessingStepComponent,
    DeviceOnlyAisQrCodeSummarayPageComponent]
})
export class DeviceOnlyAisModule { }
