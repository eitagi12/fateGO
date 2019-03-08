import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { HomeService, CaptureAndSign, PageLoadingService, AlertService, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_OTP_PAGE,
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-pre-to-post-id-card-capture-repi-page',
  templateUrl: './order-pre-to-post-id-card-capture-repi-page.component.html',
  styleUrls: ['./order-pre-to-post-id-card-capture-repi-page.component.scss']
})
export class OrderPreToPostIdCardCaptureRepiPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  idCardValid: boolean;
  apiSigned: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();
    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.apiSigned = 'OnscreenSignpad';
    } else {
      this.apiSigned = 'SignaturePad';
    }
  }
  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: customer.imageSmartCard,
      imageSignature: customer.imageSignatureSmartCard
    };
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onError(valid: boolean): void {
    this.idCardValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_OTP_PAGE]);
  }

  onNext(): void {
    this.http.post(`/api/customerportal/newRegister/updatePrepaidIdent`,
      this.getRequestUpdatePrepaidIdent()
    ).toPromise()
      .then((response: any) => {
        this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
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

  getRequestUpdatePrepaidIdent(): void {
    const customer = this.transaction.data.customer;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const data: any = {
      idCardNo: customer.idCardNo || '-',
      mobileNo: mobileNo || '-',
      birthdate: customer.birthdate || '-',
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
      imageReadSmartCard: customer.imageReadSmartCard || '-',
      isSmartCard: 'Y',
      smartCardVersion: 'v1',
      urlPicture: '-'
    };
    return data;
  }

}
