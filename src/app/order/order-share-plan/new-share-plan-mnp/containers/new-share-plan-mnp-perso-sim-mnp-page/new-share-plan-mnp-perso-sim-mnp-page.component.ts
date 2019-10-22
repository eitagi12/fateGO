import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE } from '../../constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-mnp-page',
  templateUrl: './new-share-plan-mnp-perso-sim-mnp-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-mnp-page.component.scss']
})
export class NewSharePlanMnpPersoSimMnpPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  title: string = 'กรุณาเสียบซิมการ์ด';
  transaction: Transaction;
  mobileNoMember: string;
  isSuccess: boolean;
  status: boolean = true;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.checkPersoSimMNP();
    this.mobileNoMember = this.transaction.data.simCard.mobileMember;
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkPersoSimMNP(): void {
    this.isSuccess = this.status === true ? true : false;
  }

}
