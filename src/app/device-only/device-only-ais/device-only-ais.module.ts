import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyAisSelectPaymentComponent } from './contrainers/device-only-ais-select-payment/device-only-ais-select-payment.component';
import { DeviceOnlyAisRoutingModule } from './device-only-ais-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyAisRoutingModule
  ],
  declarations: [DeviceOnlyAisSelectPaymentComponent]
})
export class DeviceOnlyAisModule { }
