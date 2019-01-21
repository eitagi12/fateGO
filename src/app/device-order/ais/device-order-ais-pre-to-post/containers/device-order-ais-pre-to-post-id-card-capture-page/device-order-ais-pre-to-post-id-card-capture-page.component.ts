import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { HomeService, CaptureAndSign, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_INFO_PAGE
} from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-pre-to-post-id-card-capture-page',
  templateUrl: './device-order-ais-pre-to-post-id-card-capture-page.component.html',
  styleUrls: ['./device-order-ais-pre-to-post-id-card-capture-page.component.scss']
})
export class DeviceOrderAisPreToPostIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  idCardValid: boolean;
  apiSigned: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
  ) {
    this.transaction = this.transactionService.load();

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.apiSigned = 'OnscreenSignpad';
    } else {
      this.apiSigned = 'SignaturePad';
    }
  }

  ngOnInit() {
    const customer: Customer = this.transaction.data.customer;
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: customer.imageSmartCard,
      imageSignature: customer.imageSignatureSmartCard
    };
  }

  onCompleted(captureAndSign: CaptureAndSign) {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onError(valid: boolean) {
    this.idCardValid = valid;
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
