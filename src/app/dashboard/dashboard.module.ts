import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule, TabsModule } from 'ngx-bootstrap';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
/* Components */
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { PromotionPageComponent } from './containers/promotion-page/promotion-page.component';
import { MainMenuPageComponent } from './containers/main-menu-page/main-menu-page.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    MyChannelSharedLibsModule,
    DashboardRoutingModule,
  ],
  declarations: [
    DashboardComponent,
    PromotionPageComponent,
    MainMenuPageComponent
  ]
})
export class DashboardModule { }
