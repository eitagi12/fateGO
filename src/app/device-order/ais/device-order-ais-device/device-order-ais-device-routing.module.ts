import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisDevicePaymentPageComponent } from './containers/device-order-ais-device-payment-page/device-order-ais-device-payment-page.component';
import { DeviceOrderAisDeviceEbillingAddressPageComponent } from './containers/device-order-ais-device-ebilling-address-page/device-order-ais-device-ebilling-address-page.component';
import { DeviceOrderAisDeviceSummaryPageComponent } from './containers/device-order-ais-device-summary-page/device-order-ais-device-summary-page.component';
import { DeviceOrderAisDeviceAggregatePageComponent } from './containers/device-order-ais-device-aggregate-page/device-order-ais-device-aggregate-page.component';
import { DeviceOrderAisDeviceQueuePageComponent } from './containers/device-order-ais-device-queue-page/device-order-ais-device-queue-page.component';
import { DeviceOrderAisDeviceResultPageComponent } from './containers/device-order-ais-device-result-page/device-order-ais-device-result-page.component';
const routes: Routes = [
  { path: '', redirectTo: 'payment', pathMatch: 'full' },
  {
    path: 'payment',
    component: DeviceOrderAisDevicePaymentPageComponent
  },
  {
    path: 'ebilling-address',
    component: DeviceOrderAisDeviceEbillingAddressPageComponent
  },
  {
    path: 'summary',
    component: DeviceOrderAisDeviceSummaryPageComponent
  },
  {
    path: 'aggregate',
    component: DeviceOrderAisDeviceAggregatePageComponent
  },
  {
    path: 'queue',
    component: DeviceOrderAisDeviceQueuePageComponent
  },
  {
    path: 'result',
    component: DeviceOrderAisDeviceResultPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisDeviceRoutingModule {
}
