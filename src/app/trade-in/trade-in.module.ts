import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeInRoutingModule } from './trade-in-routing.module';
import { TradeInComponent } from './trade-in.component';
import { VerifyTradeInComponent } from './containers/verify-trade-in/verify-trade-in.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TradeInService } from './services/trade-in.service';
import { CriteriaTradeInComponent } from './containers/criteria-trade-in/criteria-trade-in.component';
import { HeaderTradeInComponent } from './containers/header-trade-in/header-trade-in.component';
import { ConfirmTradeInComponent } from './containers/confirm-trade-in/confirm-trade-in.component';
import { SummaryTradeInComponent } from './containers/summary-trade-in/summary-trade-in.component';
import { TypeaheadModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    TradeInRoutingModule,
    MyChannelSharedLibsModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    FormsModule
  ],
  declarations: [
    TradeInComponent,
    VerifyTradeInComponent,
    CriteriaTradeInComponent,
    HeaderTradeInComponent,
    ConfirmTradeInComponent,
    SummaryTradeInComponent
  ],
  providers: [
    TradeInService
  ]
})
export class TradeInModule { }
