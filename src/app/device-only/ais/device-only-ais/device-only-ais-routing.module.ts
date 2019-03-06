import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAisQueuePageComponent } from './contrainers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './contrainers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent } from './contrainers/device-only-ais-select-payment-and-receipt-information-page/device-only-ais-select-payment-and-receipt-information-page.component';
import {DeviceOnlyAisCheckoutPaymentPageComponent} from './contrainers/device-only-ais-checkout-payment-page/device-only-ais-checkout-payment-page.component';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './contrainers/device-only-ais-select-mobile-care-page/device-only-ais-select-mobile-care-page.component';
import { DeviceOnlyAisSummaryPageComponent } from 'src/app/device-only/ais/device-only-ais/contrainers/device-only-ais-summary-page/device-only-ais-summary-page.component';
import { DeviceOnlyAisMobileCareAvaliablePageComponent} from './contrainers/device-only-ais-mobile-care-avaliable-page/device-only-ais-mobile-care-avaliable-page.component';
import { DeviceOnlyAisQrCodeSummarayPageComponent } from './contrainers/device-only-ais-qr-code-summaray-page/device-only-ais-qr-code-summaray-page.component';
import { DeviceOnlyAisQrCodeGeneratePageComponent } from './contrainers/device-only-ais-qr-code-generate-page/device-only-ais-qr-code-generate-page.component';
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
    path: 'queue-page',
    component: DeviceOnlyAisQueuePageComponent
  },
  {
    path: 'qr-code-queue-page',
    component: DeviceOnlyAisQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-summary-page',
    component: DeviceOnlyAisQrCodeSummarayPageComponent
  },
  {
    path: 'qr-code-generate-page',
    component: DeviceOnlyAisQrCodeGeneratePageComponent
  },
  {
    path: 'mobile-care-page',
    component: DeviceOnlyAisSelectMobileCarePageComponent
  },
  {
    path: 'summary-page',
    component: DeviceOnlyAisSummaryPageComponent
  },
  {
    path: 'mobile-care-avaliable-page',
    component: DeviceOnlyAisMobileCareAvaliablePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAisRoutingModule { }
