import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceOnlyAspSelectMobileCarePageComponent } from './containers/device-only-asp-select-mobile-care-page/device-only-asp-select-mobile-care-page.component';
import { DeviceOnlyAspSummaryPageComponent } from './containers/device-only-asp-summary-page/device-only-asp-summary-page.component';
import { DeviceOnlyAspReadCardPageComponent } from './containers/device-only-asp-read-card-page/device-only-asp-read-card-page.component';

const routes: Routes = [
  {
    path: 'mobile-care',
    component: DeviceOnlyAspSelectMobileCarePageComponent
  },
  {
    path: 'summary',
    component: DeviceOnlyAspSummaryPageComponent
  },
  {
    path: 'read-card',
    component: DeviceOnlyAspReadCardPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceOnlyAspRoutingModule { }
