import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';

import { CaptureAndSign, HomeService, PageLoadingService, AlertService, TokenService, Utils, ImageUtils } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_OTP_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-idcard-capture-repi-page',
  templateUrl: './device-order-ais-existing-best-buy-idcard-capture-repi-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-idcard-capture-repi-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyIdcardCaptureRepiPageComponent implements OnInit, OnDestroy {

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
    private http: HttpClient,
    private alertService: AlertService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.openCamera = !!(customer.imageSmartCard);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_OTP_PAGE]);
  }

  onNext(): void {
    this.http.post(`/api/customerportal/newRegister/updatePrepaidIdent`,
      this.getRequestUpdatePrepaidIdent()
    ).toPromise()
      .then((response: any) => {
        this.transaction.data.action = TransactionAction.KEY_IN;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_PAYMENT_DETAIL_PAGE]);
      }).catch((error) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถแสดงตนได้กรุณาติดต่อเจ้าหน้าที่');
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getRequestUpdatePrepaidIdent(): any {
    const customer = this.transaction.data.customer;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const data: any = {
      idCardNo: customer.idCardNo || '-',
      mobileNo: mobileNo || '-',
      birthdate: customer.birthdate || '',
      firstName: customer.firstName || '-',
      lastName: customer.lastName || '-',
      gender: customer.gender || '-',
      homeNo: customer.homeNo || '-',
      buildingName: customer.buildingName || '-',
      floor: customer.floor || '-',
      room: customer.room || '-',
      moo: customer.moo || '-',
      mooBan: customer.mooBan || '-',
      soi: customer.soi || '-',
      street: customer.street || '-',
      tumbol: customer.tumbol || '-',
      amphur: customer.amphur || '-',
      province: customer.province || '-',
      zipCode: customer.zipCode || '-',
      idCardImage: '-',
      imageReadSmartCard: customer.imageReadSmartCard || customer.imageSmartCard || '-',
      isSmartCard: 'Y',
      smartCardVersion: 'v1',
      urlPicture: '-'
    };
    return data;
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

    new ImageUtils().cropping(image, cropOption).then(res => {
      this.transaction.data.customer.imageSmartCard = res;
    }).catch(() => {
      this.transaction.data.customer.imageSmartCard = image;
    });
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

}
