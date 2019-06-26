import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from './containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingGadgetRoutingModule
  ],
  declarations: [

  DeviceOrderAisExistingGadgetMobileDetailPageComponent]
})
export class DeviceOrderAisExistingGadgetModule { }
