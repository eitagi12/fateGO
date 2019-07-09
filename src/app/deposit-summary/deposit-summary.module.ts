import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepositSummaryRoutingModule } from './deposit-summary-routing.module';
import { DepositSummaryComponent } from './deposit-summary.component';
import { DepositPaymentPageComponent } from './ais/container/deposit-payment-page/deposit-payment-page.component';
import { DepositPaymentSummaryPageComponent } from './ais/container/deposit-payment-summary-page/deposit-payment-summary-page.component';
import { MyChannelSharedLibsModule } from 'mychannel-shared-libs';
import { DepositPaymentSummaryComponent } from './components/deposit-payment-summary/deposit-payment-summary.component';
import { DepositQueueComponent } from './ais/container/deposit-queue/deposit-queue.component';
import { DepositResultComponent } from './ais/container/deposit-result/deposit-result.component';
import { CreateDeviceOrderService } from './services/create-device-order.service';
import { MessageConfigService } from './services/message-config.service';
import { DepositPaymentKeyInPageComponent } from './ais/container/deposit-payment-key-in-page/deposit-payment-key-in-page.component';
import { BillingAddressComponent } from './components/billing-address/billing-address.component';
import { ReceiptInformationComponent } from './components/receipt-information/receipt-information.component';
import { DepositPaymentReceiptPageComponent } from './ais/container/deposit-payment-receipt-page/deposit-payment-receipt-page.component';
import { QueuePageService } from './services/queue-page.service';
@NgModule({
  imports: [
    CommonModule,
    DepositSummaryRoutingModule,
    MyChannelSharedLibsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    DepositSummaryComponent,
    DepositPaymentPageComponent,
    DepositPaymentSummaryPageComponent,
    DepositQueueComponent,
    DepositResultComponent,
    DepositPaymentSummaryComponent,
    DepositPaymentKeyInPageComponent,
    BillingAddressComponent,
    ReceiptInformationComponent,
    DepositPaymentReceiptPageComponent],
  providers : [
    CreateDeviceOrderService,
    MessageConfigService,
    QueuePageService
  ]
})
export class DepositSummaryModule { }
