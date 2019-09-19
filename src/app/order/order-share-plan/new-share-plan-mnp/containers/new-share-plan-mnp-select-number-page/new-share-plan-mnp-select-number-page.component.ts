import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-select-number-page',
  templateUrl: './new-share-plan-mnp-select-number-page.component.html',
  styleUrls: ['./new-share-plan-mnp-select-number-page.component.scss']
})
export class NewSharePlanMnpSelectNumberPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VERIFY_INSTANT_SIM_PAGE]);
  }

}
