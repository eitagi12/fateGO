import { Component, OnInit, OnDestroy, SimpleChanges, OnChanges, EventEmitter } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType, ImageUtils, AlertService, Utils, User, AWS_WATERMARK, AWS_WATERMARK_EN } from 'mychannel-shared-libs';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE, ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE } from '../../constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-order-new-register-passport-info-page',
  templateUrl: './order-new-register-passport-info-page.component.html',
  styleUrls: ['./order-new-register-passport-info-page.component.scss']
})
export class OrderNewRegisterPassportInfoPageComponent implements OnInit, OnDestroy, OnChanges {
  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  commandSignSubscription: Subscription;

  signedSubscription: Subscription;
  camera: EventEmitter<void> = new EventEmitter<void>();

  currentLang: string;
  signedOpenSubscription: Subscription;
  translationSubscribe: Subscription;
  isOpenSign: boolean;
  openSignedCommand: any;
  watermark: any = AWS_WATERMARK;

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
    this.changeWatherMark(this.currentLang);
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      if (this.signedOpenSubscription) {
        this.signedOpenSubscription.unsubscribe();
      }
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      if (this.isOpenSign) {
        this.onSigned();
      }
      this.changeWatherMark(this.currentLang);
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

  changeWatherMark(lang: string): void {
    if (lang === 'EN') {
      this.watermark = AWS_WATERMARK_EN;
    } else {
      this.watermark = AWS_WATERMARK;
    }
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
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

  checkLogicNext(): boolean {
    if (this.transaction.data.customer.imageSignatureSmartCard) {
      return true;
    } else {
      return false;
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_VERIFY_DOCUMENT_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.customer.imageSignatureSmartCard && !this.isOpenSign) {
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE]);
    } else {
      this.getOnMessageWs();
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  mapDatanationality(): any {
    const nationality = this.transaction.data.customer.issuingCountry;
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
    this.translationSubscribe.unsubscribe();
    this.transactionService.update(this.transaction);
    if (this.commandSignSubscription) {
      this.commandSignSubscription.unsubscribe();
    }
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }

  }

  // mc-capture-and-sign
  onCameraCompleted(image: string): void {
    this.captureAndSign.imageSmartCard = image;

    this.onChangeCaptureAndSign();
  }

  onCameraError(error: string): void {
    this.onChangeCaptureAndSign();

    this.alertService.error(error);
  }

  onClearImage(): void {
    this.captureAndSign.imageSmartCard = null;

    this.onChangeCaptureAndSign();
  }

  getOnMessageWs(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.captureAndSign) {
      this.onChangeCaptureAndSign();
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
