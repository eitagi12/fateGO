import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderRoutingModule } from './device-order-routing.module';
import { DeviceOrderComponent } from './device-order.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderRoutingModule
  ],
  declarations: [DeviceOrderComponent]
})
export class DeviceOrderModule { }
