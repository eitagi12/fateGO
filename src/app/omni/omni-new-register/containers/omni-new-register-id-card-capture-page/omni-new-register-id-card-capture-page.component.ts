import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE,
  ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';

@Component({
  selector: 'app-omni-new-register-id-card-capture-page',
  templateUrl: './omni-new-register-id-card-capture-page.component.html',
  styleUrls: ['./omni-new-register-id-card-capture-page.component.scss']
})
export class OmniNewRegisterIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
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
    if (this.transaction.data.customer.caNumber) {
      if (this.transaction.data.action === TransactionAction.KEY_IN) {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
      }
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
