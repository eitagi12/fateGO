import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE } from '../../constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Utils, HomeService, ImageUtils, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-new-share-plan-mnp-face-capture-page',
  templateUrl: './new-share-plan-mnp-face-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-capture-page.component.scss']
})
export class NewSharePlanMnpFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  openCamera: boolean;
  transaction: any;
  camera: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private translation: TranslateService,
    private utils: Utils,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.openCamera = !!(this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser);
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenCamera(): void {
    this.openCamera = true;
  }

  onCameraCompleted(image: string): void {
    const cropOption = {
      sizeWidth: 160,
      sizeHeight: 240,
      startX: 80,
      startY: 0,
      flip: true,
      quality: 1
    };

    new ImageUtils().cropping(image, cropOption).then(response => {
      this.transaction.data.faceRecognition = {
        imageFaceUser: response
      };
    }).catch(() => {
      this.transaction.data.faceRecognition = {
        imageFaceUser: image
      };
    });
  }

  onCameraError(error: string): void {
    this.alertService.error(this.translation.instant(error));
  }

  onClearIdCardImage(): void {
    this.transaction.data.faceRecognition.imageFaceUser = null;
  }

  public isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
