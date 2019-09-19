import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-confirm-user-information-page',
  templateUrl: './new-share-plan-mnp-confirm-user-information-page.component.html',
  styleUrls: ['./new-share-plan-mnp-confirm-user-information-page.component.scss']
})
export class NewSharePlanMnpConfirmUserInformationPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_NETWORK_TYPE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE]);
  }

}
