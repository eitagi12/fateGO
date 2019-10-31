import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_BY_PATTERN_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-share-plan-mnp-select-number-page',
  templateUrl: './new-share-plan-mnp-select-number-page.component.html',
  styleUrls: ['./new-share-plan-mnp-select-number-page.component.scss']
})
export class NewSharePlanMnpSelectNumberPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
  }

  onVerifyInstantSim(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE]);
  }

  onByPattern(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_BY_PATTERN_PAGE]);
  }

  onBack(): void {
    if (this.transaction.data.faceRecognition.kyc === false) {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
    } else {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
