import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-share-plan-mnp-result-page',
  templateUrl: './new-share-plan-mnp-result-page.component.html',
  styleUrls: ['./new-share-plan-mnp-result-page.component.scss']
})

export class NewSharePlanMnpResultPageComponent implements OnInit {
  public isSuccess: boolean = true;
  public transaction: Transaction;
  public mobileNo: string ;
  public mobileNo1: string ;
  public simSerial: string ;
  public simSerial1: string ;
  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    // this.simSerial = this.transaction.data.simCard.simSerial;
    this.simSerial = '1234567891011';
    this.mobileNo = '0646244645';
    this.mobileNo1 = '0646244546';
    this.simSerial1 = '1234567891112';

  }

  onMainMenu(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

  nextprint(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

}
