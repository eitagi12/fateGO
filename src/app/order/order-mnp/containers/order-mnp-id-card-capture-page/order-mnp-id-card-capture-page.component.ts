import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import {
  ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE,
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CaptureAndSign, HomeService, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-order-mnp-id-card-capture-page',
  templateUrl: './order-mnp-id-card-capture-page.component.html',
  styleUrls: ['./order-mnp-id-card-capture-page.component.scss']
})
export class OrderMnpIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_MNP;

  apiSigned: string;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  idCardValid: boolean;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService
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
    this.router.navigate([ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
