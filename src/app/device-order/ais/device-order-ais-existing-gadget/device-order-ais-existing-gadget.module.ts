import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingGadgetRoutingModule
  ],
  declarations: [
    DeviceOrderAisExistingGadgetValidateCustomerPageComponent
  ]
})
export class DeviceOrderAisExistingGadgetModule { }
