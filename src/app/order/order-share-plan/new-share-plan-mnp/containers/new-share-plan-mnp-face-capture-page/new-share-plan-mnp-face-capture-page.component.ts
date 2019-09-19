import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-face-capture-page',
  templateUrl: './new-share-plan-mnp-face-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-capture-page.component.scss']
})
export class NewSharePlanMnpFaceCapturePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
  }

}
