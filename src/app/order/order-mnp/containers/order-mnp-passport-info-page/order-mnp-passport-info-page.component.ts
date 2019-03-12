import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CaptureAndSign, HomeService, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE, ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE, ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-mnp-passport-info-page',
  templateUrl: './order-mnp-passport-info-page.component.html',
  styleUrls: ['./order-mnp-passport-info-page.component.scss']
})
export class OrderMnpPassportInfoPageComponent implements OnInit {

  wizards = WIZARD_ORDER_MNP;
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
    console.log('data', customer);
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
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onCommand(command: any): void {
    this.commandSign = command;
  }

  onError(valid: boolean) {
    this.idCardValid = valid;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
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

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
