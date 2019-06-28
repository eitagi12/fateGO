import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-gadget/containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-gadget/containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';
import { DeviceOrderAisExistingGadgetCustomerInfoPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-gadget/containers/device-order-ais-existing-gadget-customer-info-page/device-order-ais-existing-gadget-customer-info-page.component';
import { DeviceOrderAisExistingGadgetPaymentDetailPageComponent } from './containers/device-order-ais-existing-gadget-payment-detail-page/device-order-ais-existing-gadget-payment-detail-page.component';
import { DeviceOrderAisExistingGadgetSummaryPageComponent } from './containers/device-order-ais-existing-gadget-summary-page/device-order-ais-existing-gadget-summary-page.component';
import { DeviceOrderAisExistingGadgetCheckOutPageComponent } from './containers/device-order-ais-existing-gadget-check-out-page/device-order-ais-existing-gadget-check-out-page.component';
import { DeviceOrderAisExistingGadgetQueuePageComponent } from './containers/device-order-ais-existing-gadget-queue-page/device-order-ais-existing-gadget-queue-page.component';
import { DeviceOrderAisExistingGadgetResultPageComponent } from './containers/device-order-ais-existing-gadget-result-page/device-order-ais-existing-gadget-result-page.component';
import { DeviceOrderAisExistingGadgetEligibleMobilePageComponent } from './containers/device-order-ais-existing-gadget-eligible-mobile-page/device-order-ais-existing-gadget-eligible-mobile-page.component';
import { DeviceOrderAisExistingGadgetAgreementSignPageComponent } from './containers/device-order-ais-existing-gadget-agreement-sign-page/device-order-ais-existing-gadget-agreement-sign-page.component';
import { DeviceOrderAisExistingGadgetEcontractPageComponent } from './containers/device-order-ais-existing-gadget-econtract-page/device-order-ais-existing-gadget-econtract-page.component';
import { DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-pi-page/device-order-ais-existing-gadget-validate-customer-pi-page.component';
import { DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-id-card-page/device-order-ais-existing-gadget-validate-customer-id-card-page.component';

const routes: Routes = [
    { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
    { path: 'validate-customer', component: DeviceOrderAisExistingGadgetValidateCustomerPageComponent },
    { path: 'validate-customer-pi', component: DeviceOrderAisExistingGadgetValidateCustomerPiPageComponent },
    { path: 'validate-customer-id-card', component: DeviceOrderAisExistingGadgetValidateCustomerIdCardPageComponent },
    { path: 'customer-info', component: DeviceOrderAisExistingGadgetCustomerInfoPageComponent },
    { path: 'eligible-mobile', component: DeviceOrderAisExistingGadgetEligibleMobilePageComponent },
    { path: 'mobile-detail', component: DeviceOrderAisExistingGadgetMobileDetailPageComponent },
    { path: 'payment-detail', component: DeviceOrderAisExistingGadgetPaymentDetailPageComponent },
    { path: 'summary', component: DeviceOrderAisExistingGadgetSummaryPageComponent },
    { path: 'agreement-sign', component: DeviceOrderAisExistingGadgetAgreementSignPageComponent },
    { path: 'check-out', component: DeviceOrderAisExistingGadgetCheckOutPageComponent },
    { path: 'econtract', component: DeviceOrderAisExistingGadgetEcontractPageComponent},
    { path: 'queue', component: DeviceOrderAisExistingGadgetQueuePageComponent },
    { path: 'result', component: DeviceOrderAisExistingGadgetResultPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingGadgetRoutingModule { }
