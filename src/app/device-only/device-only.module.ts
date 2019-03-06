import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceOnlyRoutingModule } from './device-only-routing.module';
import { DeviceOnlyComponent } from './device-only.component';

@NgModule({
  imports: [
    CommonModule,
    DeviceOnlyRoutingModule
  ],
  declarations: [
    DeviceOnlyComponent
  ]
})
export class DeviceOnlyModule { }
