import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAspCheckoutPaymentPageComponent } from './containers/device-only-asp-checkout-payment-page/device-only-asp-checkout-payment-page.component';
import { DeviceOnlyAspSelectPaymentAndReceiptInformationPageComponent } from './containers/device-only-asp-select-payment-and-receipt-information-page/device-only-asp-select-payment-and-receipt-information-page.component';
import { DeviceOnlyAspSelectMobileCarePageComponent } from './containers/device-only-asp-select-mobile-care-page/device-only-asp-select-mobile-care-page.component';
import { DeviceOnlyAspSummaryPageComponent } from './containers/device-only-asp-summary-page/device-only-asp-summary-page.component';
import { DeviceOnlyAspQueuePageComponent } from './containers/device-only-asp-queue-page/device-only-asp-queue-page.component';
import { DeviceOnlyAspResultQueuePageComponent } from './containers/device-only-asp-result-queue-page/device-only-asp-result-queue-page.component';
import { DeviceOnlyAspReadCardPageComponent } from './containers/device-only-asp-read-card-page/device-only-asp-read-card-page.component';

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
    path: 'mobile-care',
    component: DeviceOnlyAspSelectMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOnlyAspSummaryPageComponent
  },
  {
    path: 'queue',
    component: DeviceOnlyAspQueuePageComponent
  },
  {
    path: 'result-queue',
    component: DeviceOnlyAspResultQueuePageComponent
  },
  {
    path: 'read-card',
    component: DeviceOnlyAspReadCardPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAspRoutingModule { }
