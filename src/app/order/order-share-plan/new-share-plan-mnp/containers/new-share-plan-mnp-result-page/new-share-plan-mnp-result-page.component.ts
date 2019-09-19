import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-result-page',
  templateUrl: './new-share-plan-mnp-result-page.component.html',
  styleUrls: ['./new-share-plan-mnp-result-page.component.scss']
})
export class NewSharePlanMnpResultPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onMainMenu(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_PAGE]);
  }

}
