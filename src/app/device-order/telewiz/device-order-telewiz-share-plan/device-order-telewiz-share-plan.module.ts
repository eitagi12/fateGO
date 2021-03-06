import { NgModule } from '@angular/core';
import { DeviceOrderTelewizSharePlanComponent } from './device-order-telewiz-share-plan.component';
import { DeviceOrderTelewizSharePlanRoutingModule } from './device-order-telewiz-share-plan-routing.module';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RemoveCartService } from './new-register-mnp/services/remove-cart.service';
import { VerifyInstantSimService } from './new-register-mnp/services/verify-instant-sim.service';
@NgModule({
  imports: [
    CommonModule,
    DeviceOrderTelewizSharePlanRoutingModule,
    TranslateModule
  ],
  declarations: [
    DeviceOrderTelewizSharePlanComponent
  ],
  providers: [
    VerifyInstantSimService,
    RemoveCartService
  ]
})
export class DeviceOrderTelewizSharePlanModule { }
