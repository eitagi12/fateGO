import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType, AlertService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_CUSTOMER_INFO_PAGE,
  ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE,
  ROUTE_ORDER_NEW_REGISTER_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-order-new-register-id-card-capture-page',
  templateUrl: './order-new-register-id-card-capture-page.component.html',
  styleUrls: ['./order-new-register-id-card-capture-page.component.scss']
})
export class OrderNewRegisterIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;

  apiSigned: string;

  idCardValid: boolean;
  count: number = 0;
  public ocrFlag: string;
  ocrMessage: string;
  ocrMessageShow: boolean;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.apiSigned = 'OnscreenSignpad';
    } else {
      this.apiSigned = 'SignaturePad';
    }
  }

  ngOnInit(): void {
    alert('hello ja ');
    const customer: Customer = this.transaction.data.customer;
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: customer.imageSmartCard,
      imageSignature: customer.imageSignatureSmartCard
    };
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    this.alertService.error('เข้า');
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onError(valid: boolean): void {
    this.alertService.error('ไม่เข้า');
    this.idCardValid = valid;
  }

  onBack(): void {
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

  onNext(): void {
    this.alertService.error('next');
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkTypeOcr(imageOCR: string): void {
    const dataOcr: any = {
      machineId: '12345',
      command: 'classify',
      channel: 'mychannel',
      base64Image: imageOCR
    };
    this.getResultTypeOcr(dataOcr)
      .then((res: any) => {
        alert(JSON.stringify(res));
        this.ocrMessage = `${res.data.result} - ${res.data.message}`;
        const RESULT_IDCARD_NUMBER: number = 1100;
        if (this.count === 0) {
          if (res.data.result === RESULT_IDCARD_NUMBER) {
            this.ocrFlag = 'Y';
            localStorage.setItem('OCRflag', this.ocrFlag);
          } else {
            this.alertService.error('ถ่ายรูปบัตรไม่ชัดเจน / ไม่ถูกต้อง<br>ท่านสามารถถ่ายรูปได้อีก 1 ครั้ง');
            this.count++;
          }
        } else if (this.count === 1) {
          if (res.data.result === RESULT_IDCARD_NUMBER) {
            this.ocrFlag = 'Y';
            localStorage.setItem('OCRflag', this.ocrFlag);
          } else {
            this.alertService.error('ภาพถ่ายไม่ชัดเจน กรุณายืนยัน และรับรองความถูกต้องก่อนทำรายการต่อไป');
          }
        }
      }).catch((error: any) => {
        this.ocrMessage = JSON.stringify(error);
        if (this.count === 0) {
          this.alertService.error('ถ่ายรูปบัตรไม่ชัดเจน / ไม่ถูกต้อง<br>ท่านสามารถถ่ายรูปได้อีก 1 ครั้ง');
          this.count++;
        } else if (this.count === 1) {
          this.alertService.error('ภาพถ่ายไม่ชัดเจน กรุณายืนยัน และรับรองความถูกต้องก่อนทำรายการต่อไป');
        }
      });
  }

  getResultTypeOcr(ocrClassify: any): Promise<any> {
    const queryOcrClassify: string = `/facerecog/ocrclassify`;
    return this.http.post(queryOcrClassify, ocrClassify).toPromise();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
