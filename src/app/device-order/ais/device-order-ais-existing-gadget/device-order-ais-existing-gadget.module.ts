import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DeviceOrderAisExistingGadgetRoutingModule } from './device-order-ais-existing-gadget-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';
import { DeviceOrderAisExistingGadgetCustomerInfoPageComponent } from './containers/device-order-ais-existing-gadget-customer-info-page/device-order-ais-existing-gadget-customer-info-page.component';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from './containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';
import { DeviceOrderAisExistingGadgetPaymentDetailPageComponent } from './containers/device-order-ais-existing-gadget-payment-detail-page/device-order-ais-existing-gadget-payment-detail-page.component';
import { DeviceOrderAisExistingGadgetValidateIdentifyPageComponent } from './containers/device-order-ais-existing-gadget-validate-identify-page/device-order-ais-existing-gadget-validate-identify-page.component';
import { DeviceOrderAisExistingGadgetSummaryPageComponent } from './containers/device-order-ais-existing-gadget-summary-page/device-order-ais-existing-gadget-summary-page.component';
import { DeviceOrderAisExistingGadgetCheckOutPageComponent } from './containers/device-order-ais-existing-gadget-check-out-page/device-order-ais-existing-gadget-check-out-page.component';
import { DeviceOrderAisExistingGadgetQueuePageComponent } from './containers/device-order-ais-existing-gadget-queue-page/device-order-ais-existing-gadget-queue-page.component';
import { DeviceOrderAisExistingGadgetResultPageComponent } from './containers/device-order-ais-existing-gadget-result-page/device-order-ais-existing-gadget-result-page.component';
import { DeviceOrderAisExistingGadgetEligibleMobilePageComponent } from './containers/device-order-ais-existing-gadget-eligible-mobile-page/device-order-ais-existing-gadget-eligible-mobile-page.component';
import { DeviceOrderAisExistingGadgetAgreementSignPageComponent } from './containers/device-order-ais-existing-gadget-agreement-sign-page/device-order-ais-existing-gadget-agreement-sign-page.component';
import { DeviceOrderAisExistingGadgetEcontractPageComponent } from './containers/device-order-ais-existing-gadget-econtract-page/device-order-ais-existing-gadget-econtract-page.component';
import { DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-id-card-page/device-order-ais-existing-gadget-validate-customer-id-card-page.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisExistingGadgetRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MyChannelSharedLibsModule,
    TabsModule.forRoot(),
    TranslateModule
  ],
  declarations: [
    DeviceOrderAisExistingGadgetMobileDetailPageComponent,
    DeviceOrderAisExistingGadgetValidateCustomerPageComponent,
    DeviceOrderAisExistingGadgetPaymentDetailPageComponent,
    DeviceOrderAisExistingGadgetCustomerInfoPageComponent,
    DeviceOrderAisExistingGadgetValidateIdentifyPageComponent,
    DeviceOrderAisExistingGadgetSummaryPageComponent,
    DeviceOrderAisExistingGadgetCheckOutPageComponent,
    DeviceOrderAisExistingGadgetQueuePageComponent,
    DeviceOrderAisExistingGadgetResultPageComponent,
    DeviceOrderAisExistingGadgetEligibleMobilePageComponent,
    DeviceOrderAisExistingGadgetAgreementSignPageComponent,
    DeviceOrderAisExistingGadgetEcontractPageComponent,
    DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent
  ]
})
export class DeviceOrderAisExistingGadgetModule { }
