import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';
import { DeviceOrderAisExistingGadgetCustomerInfoPageComponent } from './containers/device-order-ais-existing-gadget-customer-info-page/device-order-ais-existing-gadget-customer-info-page.component';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from './containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';
import { DeviceOrderAisExistingGadgetPaymentDetailPageComponent } from './containers/device-order-ais-existing-gadget-payment-detail-page/device-order-ais-existing-gadget-payment-detail-page.component';
import { DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-pi-page/device-order-ais-existing-gadget-validate-customer-pi-page.component';

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
    DeviceOrderAisExistingGadgetValidateCustomerPageComponent,
    DeviceOrderAisExistingGadgetPaymentDetailPageComponent,
    DeviceOrderAisExistingGadgetCustomerInfoPageComponent,
    DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent
  ]
})
export class DeviceOrderAisExistingGadgetModule { }
