import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE,
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE
} from '../../constants/route-path.constant';
@Component({
  selector: 'app-order-pre-to-post-passport-info-repi-page',
  templateUrl: './order-pre-to-post-passport-info-repi-page.component.html',
  styleUrls: ['./order-pre-to-post-passport-info-repi-page.component.scss']
})
export class OrderPreToPostPassportInfoRepiPageComponent implements OnInit, OnDestroy {
  wizards = WIZARD_ORDER_PRE_TO_POST;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  apiSigned: string;

  idCardValid: boolean;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
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
      allowCapture: false,
      imageSmartCard: customer.imageReadPassport,
      imageSignature: customer.imageSignatureSmartCard
    };
    this.mapDatanationality();
    customer.titleName = customer.gender === 'F' ? 'Ms.' : 'Mr.';
  }
  onCompleted(captureAndSign: CaptureAndSign) {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageReadPassport = captureAndSign.imageSmartCard;
  }


  onError(valid: boolean) {
    this.idCardValid = valid;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_REPI_PAGE]);
  }

  onNext() {
    if (this.transaction.data.action === TransactionAction.READ_PASSPORT) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_INFO_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_CUSTOMER_PROFILE_PAGE]);
    }
  }

  onHome() {
    this.homeService.goToHome();
  }

  mapDatanationality() {
    const nationality = this.transaction.data.customer.nationality;
    return this.http.get('/api/customerportal/newRegister/queryNationality', {
      params: {
        code: nationality
      }
    }).toPromise()
      .then((resp: any) => {
        return this.transaction.data.customer.nationality = resp.data.nationality;
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }


}
