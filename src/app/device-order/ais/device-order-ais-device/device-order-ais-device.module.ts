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

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisDeviceRoutingModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
  DeviceOrderAisDevicePaymentPageComponent,
  DeviceOrderAisDeviceSummaryPageComponent,
  DeviceOrderAisDeviceAggregatePageComponent,
  DeviceOrderAisDeviceQueuePageComponent,
  DeviceOrderAisDeviceResultPageComponent,
  DeviceOrderAisDeviceEbillingAddressPageComponent]
})
export class DeviceOrderAisDeviceModule { }
