import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { CaptureAndSign, HomeService, PageLoadingService, AlertService, Utils } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_OTP_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-idcard-capture-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-idcard-capture-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-idcard-capture-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopIdcardCaptureRepiPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

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
    private customerInfoService: CustomerInfoService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.openCamera = !!(customer.imageSmartCard);
  }

  onBack(): void {
    this.onClearIdCardImage();
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_OTP_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.customerInfoService.callUpdatePrepaidIdentify(this.transaction.data.customer, this.transaction.data.simCard.mobileNo)
      .then((response: any) => {
        if (response && response.data && response.data.success) {
          this.transaction.data.action = TransactionAction.KEY_IN;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_PAYMENT_DETAIL_PAGE]);
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
    this.transaction.data.customer.imageSmartCard = image;
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
