import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from './containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';

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
    DeviceOrderAisExistingGadgetMobileDetailPageComponent,
    DeviceOrderAisExistingGadgetValidateCustomerPageComponent
  ]
})
export class DeviceOrderAisExistingGadgetModule { }
