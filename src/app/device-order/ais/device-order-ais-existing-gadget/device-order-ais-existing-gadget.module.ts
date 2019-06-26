import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingGadgetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot()
  ],
  declarations: [
    DeviceOrderAisExistingGadgetValidateCustomerPageComponent
  ]
})
export class DeviceOrderAisExistingGadgetModule { }
