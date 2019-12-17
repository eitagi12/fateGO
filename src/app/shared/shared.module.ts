import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from './services/transaction.service';
import { PriceOptionService } from './services/price-option.service';
import { CreateNewRegisterService } from './services/create-new-register.service';
import { CreatePreToPostService } from './services/create-pre-to-post.service';
import { SharedTransactionService } from './services/shared-transaction.service';
import { ValidateCustomerService } from './services/validate-customer.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    PriceOptionService,
    TransactionService,
    SharedTransactionService,
    CreateNewRegisterService,
    CreatePreToPostService,
    ValidateCustomerService
  ]
})
export class SharedModule { }
