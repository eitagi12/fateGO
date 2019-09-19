import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_EAPPLICATION_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-page',
  templateUrl: './new-share-plan-mnp-perso-sim-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-page.component.scss']
})
export class NewSharePlanMnpPersoSimPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_EAPPLICATION_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE]);
  }

}
