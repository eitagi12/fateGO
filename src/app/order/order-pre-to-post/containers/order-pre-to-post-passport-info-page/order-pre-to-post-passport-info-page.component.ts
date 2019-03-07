import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE,
  ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE
} from '../../constants/route-path.constant';


@Component({
  selector: 'app-order-pre-to-post-passport-info-page',
  templateUrl: './order-pre-to-post-passport-info-page.component.html',
  styleUrls: ['./order-pre-to-post-passport-info-page.component.scss']
})
export class OrderPreToPostPassportInfoPageComponent implements OnInit, OnDestroy {
  wizards = WIZARD_ORDER_PRE_TO_POST;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  commandSign: any;

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

  onCommand(command: any): void {
    this.commandSign = command;
  }

  onError(valid: boolean) {
    this.idCardValid = valid;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_VERIFY_DOCUMENT_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_ELIGIBLE_MOBILE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  getOnMessageWs() {
    this.commandSign.ws.send('CaptureImage');
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
