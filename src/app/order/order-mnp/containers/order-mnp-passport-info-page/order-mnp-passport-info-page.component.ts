import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { CaptureAndSign, HomeService, TokenService, ChannelType, AlertService, Utils, User, AWS_WATERMARK } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE, ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE, ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';

@Component({
  selector: 'app-order-mnp-passport-info-page',
  templateUrl: './order-mnp-passport-info-page.component.html',
  styleUrls: ['./order-mnp-passport-info-page.component.scss']
})
export class OrderMnpPassportInfoPageComponent implements OnInit, OnDestroy, OnChanges {

  wizards = WIZARD_ORDER_MNP;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  apiSigned: string;

  isOpenSign: boolean;

  currentLang: string;
  signedOpenSubscription: Subscription;
  translationSubscribe: Subscription;
  signedSubscription: Subscription;
  openSignedCommand: any;
  commandSignSubscription: Subscription;

  watermark: string = AWS_WATERMARK;

  idCardValid: boolean;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private aisNativeOrderService: AisNativeOrderService,
    private alertService: AlertService,
    private utils: Utils,
    private translationService: TranslateService

  ) {
    this.transaction = this.transactionService.load();

    this.currentLang = this.translationService.currentLang || 'TH';
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      if (this.signedOpenSubscription) {
        this.signedOpenSubscription.unsubscribe();
      }
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      if (this.isOpenSign) {
        this.onSigned();
      }
    });

    this.signedSubscription = this.aisNativeOrderService.getSigned().subscribe((signature: string) => {
      this.isOpenSign = false;
      if (signature) {
        this.transaction.data.customer.imageSignatureSmartCard = signature;
        this.captureAndSign.imageSignature = signature;
      } else {
        this.isOpenSign = true;
        this.alertService.warning(this.translationService.instant('กรุณาเซ็นลายเซ็น')).then(() => {
          this.onSigned();
        });
        return;
      }
      this.onChangeCaptureAndSign();
    });

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
    this.idCardValid = this.transaction.data.customer.imageSignatureSmartCard ? true : false;
    if (!this.transaction.data.customer.imageSignatureSmartCard) {
      this.onSigned();
    }

  }

  onCompleted(captureAndSign: CaptureAndSign) {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_MNP_VERIFY_DOCUMENT_PAGE]);
  }

  onNext() {
    if (this.transaction.data.customer.imageSignatureSmartCard && !this.isOpenSign) {
      this.router.navigate([ROUTE_ORDER_MNP_CUSTOMER_INFO_PAGE]);
    } else {
      this.getOnMessageWs();
    }
  }

  onHome() {
    this.homeService.goToHome();
  }

  getOnMessageWs() {
    this.openSignedCommand.ws.send('CaptureImage');
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
    if (this.commandSignSubscription) {
      this.commandSignSubscription.unsubscribe();
    }
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.captureAndSign) {
      this.onChangeCaptureAndSign();
    }
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

  onSigned(): void {
    this.idCardValid = false;
    this.isOpenSign = true;
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeOrderService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'OnscreenSignpad', `{x:100,y:280,Language: ${this.currentLang}}`
    ).subscribe((command: any) => {
      this.openSignedCommand = command;
    });
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  isAllowCapture(): boolean {
    return this.captureAndSign.allowCapture;
  }

  hasImageSmartCard(): boolean {
    return !!this.captureAndSign.imageSmartCard;
  }

  hasImageSignature(): boolean {
    return !!this.captureAndSign.imageSignature;
  }

  checkLogicNext(): boolean {
    if (this.transaction.data.customer.imageSignatureSmartCard) {
      return true;
    } else {
      return false;
    }
  }

  private onChangeCaptureAndSign(): void {
    let valid = false;
    valid = !!this.captureAndSign.imageSignature;
    this.idCardValid = valid;
    if (valid) {
      const customer: Customer = this.transaction.data.customer;
      customer.imageSignatureSmartCard = this.captureAndSign.imageSignature;
      customer.imageReadPassport = this.captureAndSign.imageSmartCard;
    }
  }

}
