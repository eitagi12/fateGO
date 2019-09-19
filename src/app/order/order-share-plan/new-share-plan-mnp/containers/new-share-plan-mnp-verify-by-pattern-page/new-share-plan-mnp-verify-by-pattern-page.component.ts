import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-new-share-plan-mnp-verify-by-pattern-page',
  templateUrl: './new-share-plan-mnp-verify-by-pattern-page.component.html',
  styleUrls: ['./new-share-plan-mnp-verify-by-pattern-page.component.scss']
})
export class NewSharePlanMnpVerifyByPatternPageComponent implements OnInit {

  constructor(
    private router: Router

  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

}
