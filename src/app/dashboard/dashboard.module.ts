import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
/* Components */
import { DashboardRoutingModule } from './dashboard-routing.module';
import { PromotionPageComponent } from './containers/promotion-page/promotion-page.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    MyChannelSharedLibsModule,
    DashboardRoutingModule,
  ],
  declarations: [
    PromotionPageComponent,
  ]
})
export class DashboardModule { }
