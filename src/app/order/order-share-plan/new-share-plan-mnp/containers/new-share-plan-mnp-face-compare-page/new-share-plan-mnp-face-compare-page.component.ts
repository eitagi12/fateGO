import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-face-compare-page',
  templateUrl: './new-share-plan-mnp-face-compare-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-compare-page.component.scss']
})
export class NewSharePlanMnpFaceComparePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE]);
  }

}
