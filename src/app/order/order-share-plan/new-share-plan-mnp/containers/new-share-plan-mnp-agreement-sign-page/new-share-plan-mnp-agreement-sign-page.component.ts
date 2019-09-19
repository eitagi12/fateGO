import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_EAPPLICATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-agreement-sign-page',
  templateUrl: './new-share-plan-mnp-agreement-sign-page.component.html',
  styleUrls: ['./new-share-plan-mnp-agreement-sign-page.component.scss']
})
export class NewSharePlanMnpAgreementSignPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_EAPPLICATION_PAGE]);
  }

}
