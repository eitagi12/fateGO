import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-gadget/containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';

const routes: Routes = [
    { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
    { path: 'validate-customer', component: DeviceOrderAisExistingGadgetValidateCustomerPageComponent },
    { path: 'mobile-detail', component: DeviceOrderAisExistingGadgetMobileDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingGadgetRoutingModule { }
