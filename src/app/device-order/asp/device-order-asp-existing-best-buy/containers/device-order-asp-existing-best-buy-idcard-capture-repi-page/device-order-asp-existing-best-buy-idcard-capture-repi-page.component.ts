import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';

import { CaptureAndSign, HomeService, PageLoadingService, AlertService, TokenService, Utils, ImageUtils } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS, WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_OTP_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-idcard-capture-repi-page',
  templateUrl: './device-order-asp-existing-best-buy-idcard-capture-repi-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-idcard-capture-repi-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyIdcardCaptureRepiPageComponent implements OnInit, OnDestroy {

  wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  active: number = this.tokenService.isTelewizUser() ? 3 : 2;

  transaction: Transaction;
  captureAndSign: CaptureAndSign;
  openCamera: boolean;
  camera: EventEmitter<void> = new EventEmitter<void>();

  idCardValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private utils: Utils,
    private customerInfoService: CustomerInfoService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.openCamera = !!(customer.imageSmartCard);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_OTP_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.customerInfoService.callUpdatePrepaidIdentify(this.transaction.data.customer, this.transaction.data.simCard.mobileNo)
      .then((response: any) => {
        if (response && response.data && response.data.success) {
          this.transaction.data.action = TransactionAction.READ_CARD;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_PAYMENT_DETAIL_PAGE]);
        } else {
          this.pageLoadingService.closeLoading();
          this.alertService.error('ระบบไม่สามารถแสดงตนได้กรุณาติดต่อเจ้าหน้าที่');
        }
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onOpenCamera(): void {
    this.openCamera = true;
  }

  onCameraCompleted(image: string): void {

    // const cropOption = {
    //   sizeWidth: 160,
    //   sizeHeight: 240,
    //   startX: 80,
    //   startY: 0,
    //   flip: true,
    //   quality: 1
    // };

    // new ImageUtils().cropping(image, cropOption).then(res => {
      // this.transaction.data.customer.imageSmartCard = res;
    // }).catch(() => {
      this.transaction.data.customer.imageSmartCard = image;
    // });
  }

  onCameraError(error: string): void {
    this.alertService.error(error);
  }

  onClearIdCardImage(): void {
    this.transaction.data.customer.imageSmartCard = null;
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  hasImageSmartCard(): boolean {
    return !!this.transaction.data.customer.imageSmartCard;
  }

}
