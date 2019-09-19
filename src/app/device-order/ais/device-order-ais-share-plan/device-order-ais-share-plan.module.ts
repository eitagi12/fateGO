import { NgModule } from '@angular/core';
import { DeviceOrderAisSharePlanComponent } from './device-order-ais-share-plan.component';
import { DeviceOrderAisSharePlanRoutingModule } from './device-order-ais-share-plan-routing.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAisSharePlanRoutingModule,
    TranslateModule
  ],
  declarations: [
    DeviceOrderAisSharePlanComponent
  ]
})
export class DeviceOrderAisSharePlanModule { }
