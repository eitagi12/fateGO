import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAisQueuePageComponent } from './containers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './containers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAisCheckoutPaymentPageComponent } from './containers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './containers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisSummaryPageComponent } from 'src/app/device-only/ais/device-only-ais/containers/device-only-ais-summary-page/device-only-ais-summary-page.component';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './containers/device-only-ais-qr-code-summaray-page/device-only-ais-qr-code-summaray-page.component';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './containers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
import { DeviceOnlyAisCheckoutPaymentQrCodePageComponent } from './containers/device-only-ais-checkout-payment-qr-code-page/device-only-ais-checkout-payment-qr-code-page.component';
import { DeviceOnlyAisKeyInQueuePageComponent } from './containers/device-only-ais-key-in-queue-page/device-only-ais-key-in-queue-page.component';
import { DeviceOnlyAutoGetQueuePageComponent } from './containers/device-only-ais-auto-get-queue-page/device-only-ais-auto-get-queue-page.component';
import { DeviceOnlyAisQrCodeKeyInQueuePageComponent } from './containers/device-only-ais-qr-code-key-in-queue-page/device-only-ais-qr-code-key-in-queue-page.component';
import { DeviceOnlyAisResultQueuePageComponent } from './containers/device-only-ais-result-queue-page/device-only-ais-result-queue-page.component';

const routes: Routes = [
  {
    path: 'checkout-payment',
    component: DeviceOnlyAisCheckoutPaymentPageComponent
  },
  {
    path: 'select-payment',
    component: DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent
  },
  {
    path: 'key-in-queue',
    component: DeviceOnlyAisKeyInQueuePageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOnlyAisQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-key-in-queue',
    component: DeviceOnlyAisQrCodeKeyInQueuePageComponent
  },
  {
    path: 'result-queue',
    component: DeviceOnlyAisResultQueuePageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOnlyAisQrCodeSummarayPageComponent
  },
  {
    path: 'qr-code-generate',
    component: DeviceOnlyAisQrCodeGeneratePageComponent
  },
  {
    path: 'mobile-care',
    component: DeviceOnlyAisSelectMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOnlyAisSummaryPageComponent
  },
  {
    path: 'checkout-payment-qr-code',
    component: DeviceOnlyAisCheckoutPaymentQrCodePageComponent
  },
  {
    path: 'queue',
    component: DeviceOnlyAisQueuePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAisRoutingModule { }
