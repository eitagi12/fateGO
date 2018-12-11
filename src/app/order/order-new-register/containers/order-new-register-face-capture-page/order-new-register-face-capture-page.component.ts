import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, ImageUtils } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_FACE_COMPARE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-order-new-register-face-capture-page',
  templateUrl: './order-new-register-face-capture-page.component.html',
  styleUrls: ['./order-new-register-face-capture-page.component.scss']
})
export class OrderNewRegisterFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_NEW_REGISTER;

  openCamera: boolean;
  transaction: Transaction;
  camera: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    this.homeService.callback = () => {
      window.location.href = '/smart-shop';
    };
  }

  ngOnInit() {
    this.openCamera = !!(this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser);
  }

  onBack() {
    if (this.transaction.data.action === TransactionAction.READ_CARD) {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
    }
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onOpenCamera() {
    this.openCamera = true;
  }

  onCameraCompleted(image: string) {

    const cropOption = {
      sizeWidth: 160,
      sizeHeight: 240,
      startX: 80,
      startY: 0,
      flip: true,
      quality: 1
    };

    new ImageUtils().cropping(image, cropOption).then(res => {
      this.transaction.data.faceRecognition = {
        imageFaceUser: res
      };
    }).catch(() => {
      this.transaction.data.faceRecognition = {
        imageFaceUser: image
      };
    });
  }

  onCameraError(error: string) {
    this.alertService.error(error);
  }

  onClearIdCardImage() {
    this.transaction.data.faceRecognition.imageFaceUser = null;
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
