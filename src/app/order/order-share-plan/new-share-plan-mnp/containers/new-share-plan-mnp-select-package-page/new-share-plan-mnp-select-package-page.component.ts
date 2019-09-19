import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-select-package-page',
  templateUrl: './new-share-plan-mnp-select-package-page.component.html',
  styleUrls: ['./new-share-plan-mnp-select-package-page.component.scss']
})
export class NewSharePlanMnpSelectPackagePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE]);
  }

}
