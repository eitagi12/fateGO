import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { ReservePageComponent } from './containers/reserve-page/reserve-page.component';
import { CheckingPageComponent } from './containers/checking-page/checking-page.component';

@NgModule({
  imports: [
    CommonModule,
    MyChannelSharedLibsModule,
    StockRoutingModule
  ],
  declarations: [
    StockComponent,
    ReservePageComponent,
    CheckingPageComponent
  ]
})
export class StockModule { }
