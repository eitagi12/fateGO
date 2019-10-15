import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-new-page',
  templateUrl: './new-share-plan-mnp-perso-sim-new-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-new-page.component.scss']
})
export class NewSharePlanMnpPersoSimNewPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE]);
  }

}
