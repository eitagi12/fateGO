import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAisQueuePageComponent } from './containers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './containers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import {DeviceOnlyAisCheckoutPaymentPageComponent} from './containers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './containers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisSummaryPageComponent } from 'src/app/device-only/ais/device-only-ais/containers/device-only-ais-summary-page/device-only-ais-summary-page.component';
import { DeviceOnlyAisMobileCareAvaliablePageComponent} from './containers/device-only-ais-mobile-care-avaliable-page/device-only-ais-mobile-care-avaliable-page.component';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './containers/device-only-ais-qr-code-summaray-page/device-only-ais-qr-code-summaray-page.component';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './containers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
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
    path: 'queue',
    component: DeviceOnlyAisQueuePageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOnlyAisQrCodeQueuePageComponent
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
    path: 'mobile-care-avaliable',
    component: DeviceOnlyAisMobileCareAvaliablePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAisRoutingModule { }
