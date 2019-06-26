import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingGadgetValidateCustomerPageComponent } from './containers/device-order-ais-existing-gadget-validate-customer-page/device-order-ais-existing-gadget-validate-customer-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'validate-customer', pathMatch: 'full' },
  { path: 'validate-customer', component: DeviceOrderAisExistingGadgetValidateCustomerPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingGadgetRoutingModule { }
