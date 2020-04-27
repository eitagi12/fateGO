import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisDevicePaymentPageComponent } from './containers/device-order-ais-device-payment-page/device-order-ais-device-payment-page.component';
import { DeviceOrderAisDeviceEbillingAddressPageComponent } from './containers/device-order-ais-device-ebilling-address-page/device-order-ais-device-ebilling-address-page.component';
import { DeviceOrderAisDeviceSummaryPageComponent } from './containers/device-order-ais-device-summary-page/device-order-ais-device-summary-page.component';
import { DeviceOrderAisDeviceAggregatePageComponent } from './containers/device-order-ais-device-aggregate-page/device-order-ais-device-aggregate-page.component';
import { DeviceOrderAisDeviceQueuePageComponent } from './containers/device-order-ais-device-queue-page/device-order-ais-device-queue-page.component';
import { DeviceOrderAisDeviceResultPageComponent } from './containers/device-order-ais-device-result-page/device-order-ais-device-result-page.component';
import { DeviceOrderAisDeviceQrCodeSummaryPageComponent } from 'src/app/device-order/ais/device-order-ais-device/containers/device-order-ais-device-qr-code-summary-page/device-order-ais-device-qr-code-summary-page.component';
import { DeviceOrderAisDeviceQrCodeResultPageComponent } from 'src/app/device-order/ais/device-order-ais-device/containers/device-order-ais-device-qr-code-result-page/device-order-ais-device-qr-code-result-page.component';
import { DeviceOrderAisDeviceQrCodeQueuePageComponent } from 'src/app/device-order/ais/device-order-ais-device/containers/device-order-ais-device-qr-code-queue-page/device-order-ais-device-qr-code-queue-page.component';
import { DeviceOrderAisDeviceQrCodeGeneratorPageComponent } from 'src/app/device-order/ais/device-order-ais-device/containers/device-order-ais-device-qr-code-generator-page/device-order-ais-device-qr-code-generator-page.component';
import { DeviceOrderAisDeviceEshippingAddressPageComponent } from './containers/device-order-ais-device-eshipping-address-page/device-order-ais-device-eshipping-address-page.component';
import { DeviceOrderAisDeviceOmiseSummaryPageComponent } from './containers/device-order-ais-device-omise-summary-page/device-order-ais-device-omise-summary-page.component';
import { DeviceOrderAisDeviceOmiseGeneratorPageComponent } from './containers/device-order-ais-device-omise-generator-page/device-order-ais-device-omise-generator-page.component';
import { DeviceOrderAisDeviceOmiseQueuePageComponent } from './containers/device-order-ais-device-omise-queue-page/device-order-ais-device-omise-queue-page.component';
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
    path: 'eshipping-address',
    component: DeviceOrderAisDeviceEshippingAddressPageComponent
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
  {
    path: 'qr-code-summary',
    component: DeviceOrderAisDeviceQrCodeSummaryPageComponent
  },
  {
    path: 'qr-code-generator',
    component: DeviceOrderAisDeviceQrCodeGeneratorPageComponent
  },
  {
    path: 'qr-code-queue',
    component: DeviceOrderAisDeviceQrCodeQueuePageComponent
  },
  {
    path: 'qr-code-result',
    component: DeviceOrderAisDeviceQrCodeResultPageComponent
  },
  {
    path: 'omise-summary',
    component: DeviceOrderAisDeviceOmiseSummaryPageComponent
  },
  {
    path: 'omise-generator',
    component: DeviceOrderAisDeviceOmiseGeneratorPageComponent
  },
  {
    path: 'omise-queue',
    component: DeviceOrderAisDeviceOmiseQueuePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisDeviceRoutingModule {
}
