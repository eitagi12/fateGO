import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAspCheckoutPaymentPageComponent } from './containers/device-only-asp-checkout-payment-page/device-only-asp-checkout-payment-page.component';
import { DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-asp-select-payment-and-receipt-information-page/device-only-asp-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAspQrCodeSummaryPageComponent } from './containers/device-only-asp-qr-code-summary-page/device-only-asp-qr-code-summary-page.component';
import { DeviceOnlyAspQrCodeGeneratePageComponent } from './containers/device-only-asp-qr-code-generate-page/device-only-asp-qr-code-generate-page.component';
import { DeviceOnlyAspSelectMobileCarePageComponent } from './containers/device-only-asp-select-mobile-care-page/device-only-asp-select-mobile-care-page.component';
import { DeviceOnlyAspSummaryPageComponent } from './containers/device-only-asp-summary-page/device-only-asp-summary-page.component';
import { DeviceOnlyAspCheckoutPaymentQrCodePageComponent } from './containers/device-only-asp-checkout-payment-qr-code-page/device-only-asp-checkout-payment-qr-code-page.component';
import { DeviceOnlyAspQueuePageComponent } from './containers/device-only-asp-queue-page/device-only-asp-queue-page.component';
import { DeviceOnlyAspQrCodeQueuePageComponent } from './containers/device-only-asp-qr-code-queue-page/device-only-asp-qr-code-queue-page.component';
import { DeviceOnlyAspQrCodeKeyInQueuePageComponent } from './containers/device-only-asp-qr-code-key-in-queue-page/device-only-asp-qr-code-key-in-queue-page.component';
import { DeviceOnlyAspResultQueuePageComponent } from './containers/device-only-asp-result-queue-page/device-only-asp-result-queue-page.component';

const routes: Routes = [
  {
    path: 'checkout-payment',
    component: DeviceOnlyAspCheckoutPaymentPageComponent
  },
  {
    path: 'select-payment',
    component: DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOnlyAspQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-generate',
    component: DeviceOnlyAspQrCodeGeneratePageComponent
  },
  {
    path: 'mobile-care',
    component: DeviceOnlyAspSelectMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOnlyAspSummaryPageComponent
  },
  {
    path: 'checkout-payment-qr-code',
    component: DeviceOnlyAspCheckoutPaymentQrCodePageComponent
  },
  {
    path: 'queue',
    component: DeviceOnlyAspQueuePageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOnlyAspQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-key-in-queue',
    component: DeviceOnlyAspQrCodeKeyInQueuePageComponent
  },
  {
    path: 'result-queue',
    component: DeviceOnlyAspResultQueuePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAspRoutingModule { }
