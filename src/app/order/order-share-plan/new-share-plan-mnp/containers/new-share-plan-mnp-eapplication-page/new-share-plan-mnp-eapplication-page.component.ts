import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-eapplication-page',
  templateUrl: './new-share-plan-mnp-eapplication-page.component.html',
  styleUrls: ['./new-share-plan-mnp-eapplication-page.component.scss']
})
export class NewSharePlanMnpEapplicationPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_PAGE]);
  }

}
