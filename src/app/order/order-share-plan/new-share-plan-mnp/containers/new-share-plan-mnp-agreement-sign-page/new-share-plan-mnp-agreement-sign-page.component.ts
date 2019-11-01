import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_NEW_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { HomeService, AlertService, TokenService, User, ChannelType } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
import { TranslateService } from '@ngx-translate/core';
import * as Moment from 'moment';
import { environment } from 'src/environments/environment';

declare let $: any;
declare let window: any;

@Component({
  selector: 'app-new-share-plan-mnp-agreement-sign-page',
  templateUrl: './new-share-plan-mnp-agreement-sign-page.component.html',
  styleUrls: ['./new-share-plan-mnp-agreement-sign-page.component.scss']
})
export class NewSharePlanMnpAgreementSignPageComponent implements OnInit, OnDestroy {

  aisNative: any = window.aisNative;
  iosNative: any = window.iosNative;
  signatureText: string = 'เซ็นลายเซ็น';
  img: any;
  signature: boolean = false;
  date: any;
  today: any;
  imageSignature: string;
  imageSignatureBase64: string;
  isDeviceSale: boolean;
  // tslint:disable-next-line: max-line-length
  contractText: string = 'ข้าพเจ้าผู้ใช้บริการขอรับรองว่าลายมือชื่อในแบบคำขอนี้ และข้อมูลรายละเอียดจากบัตรประจำตัวประชาชนที่ได้ให้แก่บริษัท เป็นลายมือชื่อและข้อมูลที่แท้จริงของข้าพเจ้า ข้าพเจ้าได้อ่านและเข้าใจพร้อมตกลงปฏิบัติตาม "ข้อตกลงและเงื่อนไขการให้บริการโทรศัพท์เคลื่อนที่ฯ(Postpaid)" ของ บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด แล้วจึงได้ตกลงสมัครใช้บริการกับบริษัท ทั้งนี้ข้าพเจ้ายินยอมให้บริษัทจำกัดวงเงินการใช้บริการ และประมวลผลข้อมูลของข้าพเจ้าเพื่อนำไปใช้ประโยชน์เกี่ยวกับ หรือเกี่ยวเนื่องกับการให้บริการโทรศัพท์เคลื่อนที่';
  webSocketEndpoint: string = environment.WEB_CONNECT_URL + '/SignaturePad';
  base64Signature: string;
  isOfferTypeHandsetDiscount: boolean;
  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  transaction: Transaction;
  openSignedCommand: any;
  // tslint:disable-next-line: max-line-length
  mockSignature: string = '<signature>' + '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' + '</signature>';
  signeturePath: string = 'IOS://param?Action=signature';
  isSuccess: boolean;

  constructor(
    private zone: NgZone,
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeOrderService: AisNativeOrderService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private translationService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.date = Moment();
    // tslint:disable-next-line:radix
    this.today = this.date.format('DD') + '/' + this.date.format('MM') + '/' + (parseInt(this.date.format('YYYY')) + 543);
  }

  ngOnInit(): void {
    this.aisNative = this.aisNative || this.iosNative || {
      sendIccCommand: (): void => {/**/
      },
      captureSignature: (): void => {
        if (this.signatureText === 'แก้ไขลายเซ็น') {
          this.signature = false;
        }
        this.onSignPad();
      }
    };
    window.onSignatureCallback = (signature: any): void => {
      if (signature && signature.length > 0) {
        this.zone.run(() => {
          this.signature = true;
          this.signatureText = 'แก้ไขลายเซ็น';
          const parser: any = new DOMParser();
          const xmlDoc: any = parser.parseFromString(signature, 'text/xml');
          this.imageSignature = 'data:image/jpg;base64,' + xmlDoc.getElementsByTagName('signature')[0].firstChild.nodeValue + '';
          this.imageSignatureBase64 = xmlDoc.getElementsByTagName('signature')[0].firstChild.nodeValue + '';
          this.img = document.getElementById('imgPhoto');
          this.img.setAttribute('src', this.imageSignature);
          if (this.signatureText === 'แก้ไขลายเซ็น' && this.imageSignature) {
            this.isSuccess = true;
            this.transaction.data.customer.imageSignature = this.imageSignatureBase64;
          } else {
            this.isSuccess = false;
          }
        });
      }
    };

  }

  onSignPad(): void {
    if ('WebSocket' in window) {
      const _ws: any = new WebSocket(this.webSocketEndpoint);
      _ws.onopen = (() => {
        const message = '{Who:Customer,Why:Purchase}';
        _ws.send(message);
      });

      _ws.onmessage = ((evt: any) => {
        // Web socket get message
        this.signature = true;
        this.onGetMessage(evt.data);
      });
      _ws.onclose = (() => {
        // websocket is closed.
      });

      _ws.onerror = ((evt: any) => {
        this.alertService.error('ไม่สามารถเซ็นลายเซ็นได้ กรุณาตรวจสอบ AISWebConnect หรือติดต่อ 02-029-6303');
        // this.alertService.openPopup();
        if (environment.name !== 'prod' && environment.name !== 'sit') {
          window.onSignatureCallback(this.mockSignature);
        }
      });
    } else {
      // The browser doesn't support WebSocket
      this.alertService.error('ไม่สามารถเซ็นลายเซ็นได้ กรุณาตรวจสอบ AISWebConnect หรือติดต่อ 02-029-6303');
      // this.alertService.openPopup();
      if (environment.name !== 'prod' && environment.name !== 'sit') {
        window.onSignatureCallback(this.mockSignature);
      }
    }
  }

  onGetMessage(jsonString: any): void {
    const label = document.getElementById('socket-message');
    const obj = JSON.parse(jsonString);
    if (obj.Event === 'OnCardInserted') {
      label.innerHTML = 'Card inserted';
      label.style.color = 'blue';
      $('.progress-bar').css('width', '0%').text('0 %');
    } else if (obj.Event === 'OnCardRemoved') {
      label.innerHTML = 'Card removed';
      label.style.color = 'blue';
    } else if (obj.Event === 'OnCardLoadProgress') {
      const value = obj.Progress;
      $('.progress-bar').css('width', value + '%').text(value + ' %');
    } else if (obj.Event === 'OnSigPadCompleted') {
      this.base64Signature = obj.SigImage;
      if (this.base64Signature != null) {
        window.onSignatureCallback('<?xml version="1.0" encoding="UTF-8"?>' + '<signature>' + this.base64Signature + '</signature>');
      }
    } else if (obj.Event === 'OnSigPadError') {
      label.innerHTML = obj.Message;
      label.style.color = 'red';
    }
  }

  openSignature(): void {
    if (window.iosNative) {
      window.location = this.signeturePath;
    } else {
      this.aisNative.captureSignature();
    }
  }

  ngOnDestroy(): void {
    // this.signedSignatureSubscription.unsubscribe();
    // if (this.signedOpenSubscription) {
    //   this.signedOpenSubscription.unsubscribe();
    // }
    // if (this.translationSubscribe) {
    //   this.translationSubscribe.unsubscribe();
    // }
    this.transactionService.update(this.transaction);
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SUMMARY_PAGE]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    }

    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_MNP_PAGE]);
    } else {
      this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_PERSO_SIM_NEW_PAGE]);
    }

  }

}
