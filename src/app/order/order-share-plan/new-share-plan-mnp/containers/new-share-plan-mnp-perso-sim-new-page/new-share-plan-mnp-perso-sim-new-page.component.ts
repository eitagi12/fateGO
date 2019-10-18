import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-new-page',
  templateUrl: './new-share-plan-mnp-perso-sim-new-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-new-page.component.scss']
})
export class NewSharePlanMnpPersoSimNewPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  mobileNo: string;
  isSuccessback: boolean;
  isSuccessnext: boolean;
  status: boolean;
  show: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.status = this.transaction.data.simCard.persoSim;
    this.checkPersoSimNEW();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {

    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE]);
  }

  checkPersoSimNEW(): void {
    this.isSuccessnext = this.status === true ? true : false;
    this.show = this.status === true ? true : false;
    this.isSuccessback = this.status === false ? true : false;
  }

}
