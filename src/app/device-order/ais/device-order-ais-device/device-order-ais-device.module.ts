import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeviceOrderAisDeviceRoutingModule } from './device-order-ais-device-routing.module';
import { DeviceOrderAisDevicePaymentPageComponent } from './containers/device-order-ais-device-payment-page/device-order-ais-device-payment-page.component';
import { DeviceOrderAisDeviceSummaryPageComponent } from './containers/device-order-ais-device-summary-page/device-order-ais-device-summary-page.component';
import { DeviceOrderAisDeviceAggregatePageComponent } from './containers/device-order-ais-device-aggregate-page/device-order-ais-device-aggregate-page.component';
import { DeviceOrderAisDeviceQueuePageComponent } from './containers/device-order-ais-device-queue-page/device-order-ais-device-queue-page.component';
import { DeviceOrderAisDeviceResultPageComponent } from './containers/device-order-ais-device-result-page/device-order-ais-device-result-page.component';
import { DeviceOrderAisDeviceEbillingAddressPageComponent } from './containers/device-order-ais-device-ebilling-address-page/device-order-ais-device-ebilling-address-page.component';
import { DeviceOrderAisDeviceQrCodeGeneratorPageComponent } from './containers/device-order-ais-device-qr-code-generator-page/device-order-ais-device-qr-code-generator-page.component';
import { DeviceOrderAisDeviceQrCodeQueuePageComponent } from './containers/device-order-ais-device-qr-code-queue-page/device-order-ais-device-qr-code-queue-page.component';
import { DeviceOrderAisDeviceQrCodeResultPageComponent } from './containers/device-order-ais-device-qr-code-result-page/device-order-ais-device-qr-code-result-page.component';
import { DeviceOrderAisDeviceQrCodeSummaryPageComponent } from './containers/device-order-ais-device-qr-code-summary-page/device-order-ais-device-qr-code-summary-page.component';
import { DeviceOrderAisDeviceEshippingAddressPageComponent } from './containers/device-order-ais-device-eshipping-address-page/device-order-ais-device-eshipping-address-page.component';
import { DeviceOrderAisDeviceOmiseSummaryPageComponent } from './containers/device-order-ais-device-omise-summary-page/device-order-ais-device-omise-summary-page.component';
import { DeviceOrderAisDeviceOmiseGeneratorPageComponent } from './containers/device-order-ais-device-omise-generator-page/device-order-ais-device-omise-generator-page.component';
import { DeviceOrderAisDeviceOmiseQueuePageComponent } from './containers/device-order-ais-device-omise-queue-page/device-order-ais-device-omise-queue-page.component';
import { DeviceOnlySharedModule } from 'src/app/device-only/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisDeviceRoutingModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DeviceOnlySharedModule
  ],
  declarations: [
  DeviceOrderAisDevicePaymentPageComponent,
  DeviceOrderAisDeviceSummaryPageComponent,
  DeviceOrderAisDeviceAggregatePageComponent,
  DeviceOrderAisDeviceQueuePageComponent,
  DeviceOrderAisDeviceResultPageComponent,
  DeviceOrderAisDeviceEbillingAddressPageComponent,
  DeviceOrderAisDeviceQrCodeGeneratorPageComponent,
  DeviceOrderAisDeviceQrCodeQueuePageComponent,
  DeviceOrderAisDeviceQrCodeResultPageComponent,
  DeviceOrderAisDeviceQrCodeSummaryPageComponent,
  DeviceOrderAisDeviceEshippingAddressPageComponent,
  DeviceOrderAisDeviceOmiseSummaryPageComponent,
  DeviceOrderAisDeviceOmiseGeneratorPageComponent,
  DeviceOrderAisDeviceOmiseQueuePageComponent
]
})
export class DeviceOrderAisDeviceModule { }
