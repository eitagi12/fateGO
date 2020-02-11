import { NgModule } from '@angular/core';
import { DeviceOrderAspSharePlanRoutingModule } from './device-order-asp-share-plan-routing.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceOrderAspSharePlanComponent } from './device-order-asp-share-plan.component';
import { RemoveCartService } from './new-register-mnp/services/remove-cart.service';
@NgModule({
  imports: [
    CommonModule,
    DeviceOrderAspSharePlanRoutingModule,
    TranslateModule
  ],
  declarations: [
    DeviceOrderAspSharePlanComponent
  ],
  providers: [
    RemoveCartService
  ]
})
export class DeviceOrderAspSharePlanModule { }
