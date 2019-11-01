import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';

@Component({
  selector: 'app-new-share-plan-mnp-select-package-member-page',
  templateUrl: './new-share-plan-mnp-select-package-member-page.component.html',
  styleUrls: ['./new-share-plan-mnp-select-package-member-page.component.scss']
})
export class NewSharePlanMnpSelectPackageMemberPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;

  constructor(
    private router: Router,
    private homeService: HomeService
  ) {

  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

}
