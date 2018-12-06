import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
@Component({
  selector: 'app-order-new-register-id-card-capture-page',
  templateUrl: './order-new-register-id-card-capture-page.component.html',
  styleUrls: ['./order-new-register-id-card-capture-page.component.scss']
})
export class OrderNewRegisterIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  apiSigned: string;

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
    if (this.transaction.data.customer.caNumber) {
      if (this.transaction.data.action === TransactionAction.KEY_IN) {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
      } else {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE]);
    }
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
