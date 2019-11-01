import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE } from '../../constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Utils, HomeService, ImageUtils, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-share-plan-mnp-face-capture-page',
  templateUrl: './new-share-plan-mnp-face-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-capture-page.component.scss']
})
export class NewSharePlanMnpFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  openCamera: boolean;
  camera: EventEmitter<void> = new EventEmitter<void>();
  transaction: Transaction;
  isCaptureSuccess: boolean = false;
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
    if (this.transaction && this.transaction.data &&
      this.transaction.data.faceRecognition) {
      delete this.transaction.data.faceRecognition.imageFaceUser;
    }

  }

  onBack(): void {
    if (this.transaction.data.action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
    } else {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_ID_CARD_CAPTURE_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_COMPARE_PAGE]);
  }

  onOpenCamera(): void {
    this.openCamera = true;
  }

  onCameraCompleted(image: string): void {
    this.isCaptureSuccess = image ? true : false;
    this.transaction.data.faceRecognition = {
      imageFaceUser: image
    };

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
