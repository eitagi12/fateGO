import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE } from '../../constants/route-path.constant';
import { CaptureAndSign, TokenService, ChannelType, HomeService } from 'mychannel-shared-libs';
import { Customer, Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { TransactionType } from 'src/app/trade-in/services/models/trade-in-transcation.model';
@Component({
  selector: 'app-new-share-plan-mnp-id-card-capture-page',
  templateUrl: './new-share-plan-mnp-id-card-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-id-card-capture-page.component.scss']
})
export class NewSharePlanMnpIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  captureAndSign: CaptureAndSign;
  apiSigned: string;
  transaction: Transaction;
  customer: Customer;
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
    this.getCustomer();
    this.setCaptureAndSign();
  }

  private setCaptureAndSign(): void {
    const customer: any = this.transaction.data.customer;
    this.getCustomer();
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: this.customer.imageSmartCard,
      imageSignature: this.customer.imageSignatureSmartCard
    };
  }

  private getCustomer(): void {
    this.customer = this.transaction.data.customer;
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    this.customer = this.transaction.data.customer;
    this.customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    this.customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onError(valid: boolean): void {
    this.idCardValid = valid;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
