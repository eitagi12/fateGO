import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { HomeService, CaptureAndSign, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE,
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';

@Component({
  selector: 'app-order-pre-to-post-id-card-capture-page',
  templateUrl: './order-pre-to-post-id-card-capture-page.component.html',
  styleUrls: ['./order-pre-to-post-id-card-capture-page.component.scss']
})
export class OrderPreToPostIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_PRE_TO_POST;

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
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
