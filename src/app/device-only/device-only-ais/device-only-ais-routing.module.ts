import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAisQueuePageComponent } from './contrainers/device-only-ais-queue-page/device-only-ais-queue-page.component';
import { DeviceOnlyAisQrCodeQueuePageComponent } from './contrainers/device-only-ais-qr-code-queue-page/device-only-ais-qr-code-queue-page.component';
import { SelectPaymentAndReceiptInformationPageComponent } from './contrainers/select-payment-and-receipt-information-page/select-payment-and-receipt-information-page.component';

const routes: Routes = [
  {
    path: 'select-payment',
    component: SelectPaymentAndReceiptInformationPageComponent
  },
  {
    path: 'queue-page',
    component: DeviceOnlyAisQueuePageComponent
  },
  {
    path: 'qr-code-queue-page',
    component: DeviceOnlyAisQrCodeQueuePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAisRoutingModule { }
