import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, ImageUtils, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGREEMENT_SIGN_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_COMPARE_PAGE
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/device-order/ais/device-order-ais-mnp/models/transaction.model';

@Component({
  selector: 'app-new-register-mnp-face-capture-page',
  templateUrl: './new-register-mnp-face-capture-page.component.html',
  styleUrls: ['./new-register-mnp-face-capture-page.component.scss']
})
export class NewRegisterMnpFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  shoppingCart: ShoppingCart;
  openCamera: boolean;
  transaction: Transaction;
  camera: EventEmitter<void> = new EventEmitter<void>();
  isCaptureSuccess: boolean = false;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private utils: Utils,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.openCamera = !!(this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.faceRecognition.imageFaceUser) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_COMPARE_PAGE]);
    } else {
      this.onOpenCamera();
    }
  }

  onHome(): void {
    this.homeService.goToHome();
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
    this.alertService.error(error);
  }

  onClearIdCardImage(): void {
    this.transaction.data.faceRecognition.imageFaceUser = null;
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  ngOnDestroy(): void {
    if (this.transaction) {
      this.transactionService.update(this.transaction);
    }
  }

}
