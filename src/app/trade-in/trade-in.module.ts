import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeInRoutingModule } from './trade-in-routing.module';
import { TradeInComponent } from './trade-in.component';
import { VerifyTradeInComponent } from './containers/verify-trade-in/verify-trade-in.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TradeInService } from './services/trade-in.service';


@NgModule({
  imports: [
    CommonModule,
    TradeInRoutingModule,
    MyChannelSharedLibsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    TradeInComponent,
    VerifyTradeInComponent
  ],
  providers: [
    TradeInService
  ]
})
export class TradeInModule { }
