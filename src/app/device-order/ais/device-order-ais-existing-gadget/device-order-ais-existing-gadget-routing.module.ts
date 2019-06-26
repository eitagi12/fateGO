import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOrderAisExistingGadgetMobileDetailPageComponent } from 'src/app/device-order/ais/device-order-ais-existing-gadget/containers/device-order-ais-existing-gadget-mobile-detail-page/device-order-ais-existing-gadget-mobile-detail-page.component';

const routes: Routes = [
  { path: 'mobile-detail', component: DeviceOrderAisExistingGadgetMobileDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOrderAisExistingGadgetRoutingModule { }
