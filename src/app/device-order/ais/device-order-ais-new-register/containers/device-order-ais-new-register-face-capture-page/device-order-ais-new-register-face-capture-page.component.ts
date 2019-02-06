import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, ImageUtils, ShoppingCart } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/ais/device-order-ais-new-register/service/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-new-register-face-capture-page',
  templateUrl: './device-order-ais-new-register-face-capture-page.component.html',
  styleUrls: ['./device-order-ais-new-register-face-capture-page.component.scss']
})
export class DeviceOrderAisNewRegisterFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;

  openCamera: boolean;
  transaction: Transaction;
  camera: EventEmitter<void> = new EventEmitter<void>();

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

  ngOnInit() {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.openCamera = !!(this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser);
  }

  onBack() {
    // if (this.transaction.data.action === TransactionAction.READ_CARD) {
    //   this.router.navigate([]);
    // } else {
    //   this.router.navigate([ROUTE_ORDER_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
    // }
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE]);
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
