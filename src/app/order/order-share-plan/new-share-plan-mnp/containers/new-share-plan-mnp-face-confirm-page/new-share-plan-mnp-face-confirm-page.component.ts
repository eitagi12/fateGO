import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-face-confirm-page',
  templateUrl: './new-share-plan-mnp-face-confirm-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-confirm-page.component.scss']
})
export class NewSharePlanMnpFaceConfirmPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]);
  }

}
