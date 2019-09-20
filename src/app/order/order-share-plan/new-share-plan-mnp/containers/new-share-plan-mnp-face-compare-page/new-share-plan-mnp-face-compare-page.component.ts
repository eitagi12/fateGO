import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE } from '../../constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { CaptureAndSign, HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-new-share-plan-mnp-face-compare-page',
  templateUrl: './new-share-plan-mnp-face-compare-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-compare-page.component.scss']
})
export class NewSharePlanMnpFaceComparePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  captureAndSign: CaptureAndSign;

  constructor(
    private router: Router,
    private translation: TranslateService,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    // this.transactionService.update(this.transaction);
  }

}
