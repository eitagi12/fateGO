import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeInRoutingModule } from './trade-in-routing.module';
import { TradeInComponent } from './trade-in.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TradeInService } from './services/trade-in.service';
import { TypeaheadModule } from 'ngx-bootstrap';
import { SummaryTradeInPageComponent } from './containers/summary-trade-in-page/summary-trade-in-page.component';
import { CriteriaTradeInPageComponent } from './containers/criteria-trade-in-page/criteria-trade-in-page.component';
import { VerifyTradeInPageComponent } from 'src/app/trade-in/containers/verify-trade-in-page/verify-trade-in-page.component';
import { HeaderTradeInPageComponent } from 'src/app/trade-in/containers/header-trade-in-page/header-trade-in-page.component';
import { ConfirmTradeInPageComponent } from 'src/app/trade-in/containers/confirm-trade-in-page/confirm-trade-in-page.component';

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
    VerifyTradeInPageComponent,
    HeaderTradeInPageComponent,
    ConfirmTradeInPageComponent,
    SummaryTradeInPageComponent,
    CriteriaTradeInPageComponent
  ],
  providers: [
    TradeInService
  ]
})
export class TradeInModule { }
