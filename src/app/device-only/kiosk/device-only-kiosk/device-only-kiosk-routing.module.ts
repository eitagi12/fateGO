import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyKioskCheckoutPaymentPageComponent } from './containers/device-only-kiosk-checkout-payment-page/device-only-kiosk-checkout-payment-page.component';
import { DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-kiosk-select-payment-and-receipt-information-page/device-only-kiosk-select-payment-and-receipt-information-page.component';
import { DeviceOnlyKioskSelectMobileCarePageComponent } from './containers/device-only-kiosk-select-mobile-care-page/device-only-kiosk-select-mobile-care-page.component';
import { DeviceOnlyKioskSummaryPageComponent } from './containers/device-only-kiosk-summary-page/device-only-kiosk-summary-page.component';
import { DeviceOnlyKioskCheckoutPaymentQrCodePageComponent } from './containers/device-only-kiosk-checkout-payment-qr-code-page/device-only-kiosk-checkout-payment-qr-code-page.component';
import { DeviceOnlyKioskQrCodeQueuePageComponent } from './containers/device-only-kiosk-qr-code-queue-page/device-only-kiosk-qr-code-queue-page.component';
import { DeviceOnlyKioskQrCodeGenaratePageComponent } from './containers/device-only-kiosk-qr-code-genarate-page/device-only-kiosk-qr-code-genarate-page.component';
import { DeviceOnlyKioskQrCodeSummaryPageComponent } from './containers/device-only-kiosk-qr-code-summary-page/device-only-kiosk-qr-code-summary-page.component';
import { DeviceOnlyKioskQueuePageComponent } from './containers/device-only-kiosk-queue-page/device-only-kiosk-queue-page.component';
import { DeviceOnlyKioskResultQueuePageComponent } from './containers/device-only-kiosk-result-queue-page/device-only-kiosk-result-queue-page.component';
import { DeviceOnlyKioskOmiseSummaryPageComponent } from './containers/device-only-kiosk-omise-summary-page/device-only-kiosk-omise-summary-page.component';
import { DeviceOnlyKioskOmiseGeneratorPageComponent } from './containers/device-only-kiosk-omise-generator-page/device-only-kiosk-omise-generator-page.component';
import { DeviceOnlyKioskOmiseQueuePageComponent } from './containers/device-only-kiosk-omise-queue-page/device-only-kiosk-omise-queue-page.component';
import { DeviceOnlyKioskOmiseResultPageComponent } from './containers/device-only-kiosk-omise-result-page/device-only-kiosk-omise-result-page.component';

const routes: Routes = [
  {
    path: 'checkout-payment',
    component: DeviceOnlyKioskCheckoutPaymentPageComponent
  },
  {
    path: 'select-payment',
    component: DeviceOnlyKioskSelectPaymentAndReceiptInformationPageComponent
  },
  {
    path: 'qr-code-summary',
    component: DeviceOnlyKioskQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-generate',
    component: DeviceOnlyKioskQrCodeGenaratePageComponent
  },
  {
    path: 'mobile-care',
    component: DeviceOnlyKioskSelectMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOnlyKioskSummaryPageComponent
  },
  {
    path: 'checkout-payment-qr-code',
    component: DeviceOnlyKioskCheckoutPaymentQrCodePageComponent
  },
  {
    path: 'queue',
    component: DeviceOnlyKioskQueuePageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOnlyKioskQrCodeQueuePageComponent
  },
  {
    path: 'result-queue',
    component: DeviceOnlyKioskResultQueuePageComponent
  },
  {
    path: 'omise-summary',
    component: DeviceOnlyKioskOmiseSummaryPageComponent
  },
  {
    path: 'omise-generator',
    component: DeviceOnlyKioskOmiseGeneratorPageComponent
  },
  {
    path: 'omise-queue',
    component: DeviceOnlyKioskOmiseQueuePageComponent
  },
  {
    path: 'omise-result',
    component: DeviceOnlyKioskOmiseResultPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyKioskRoutingModule { }
