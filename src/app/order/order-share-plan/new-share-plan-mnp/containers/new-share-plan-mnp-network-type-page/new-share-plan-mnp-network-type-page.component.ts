import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-network-type-page',
  templateUrl: './new-share-plan-mnp-network-type-page.component.html',
  styleUrls: ['./new-share-plan-mnp-network-type-page.component.scss']
})
export class NewSharePlanMnpNetworkTypePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

}
