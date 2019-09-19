import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-verify-instant-sim-page',
  templateUrl: './new-share-plan-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./new-share-plan-mnp-verify-instant-sim-page.component.scss']
})
export class NewSharePlanMnpVerifyInstantSimPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_PAGE]);
  }

}
