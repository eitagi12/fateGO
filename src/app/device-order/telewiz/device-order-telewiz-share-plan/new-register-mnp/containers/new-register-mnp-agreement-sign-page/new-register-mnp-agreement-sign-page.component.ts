import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  HomeService,
  TokenService,
  ShoppingCart,
  CaptureAndSign,
  AlertService,
  User,
  ChannelType,
  AWS_WATERMARK,
  CaptureSignedWithCard,
  AisNativeService,
  Utils
} from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE
} from '../../constants/route-path.constant';
import { Subscription, from } from 'rxjs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { AgreementSignConstant } from 'src/app/device-order/telewiz/device-order-telewiz-share-plan/new-register-mnp/constants/constants';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { RemoveCartService } from '../../services/remove-cart.service';
import { environment } from 'src/environments/environment';
declare let window: any;

@Component({
  selector: 'app-new-register-mnp-agreement-sign-page',
  templateUrl: './new-register-mnp-agreement-sign-page.component.html',
  styleUrls: ['./new-register-mnp-agreement-sign-page.component.scss']
})
export class NewRegisterMnpAgreementSignPageComponent implements OnInit, OnDestroy {

  /// convert sign image
  @ViewChild('signImage') signImage: ElementRef;
  signed: boolean = false;

 wizards: string[];
 wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;
 wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;

  transaction: Transaction;
  priceOption: PriceOption;

  // captureAndSign
  shoppingCart: ShoppingCart;
  captureAndSign: CaptureAndSign;
  apiSigned: 'SignaturePad' | 'OnscreenSignpad';
  idCardValid: boolean;
  camera: EventEmitter<void> = new EventEmitter<void>();

  // signature
  signatureImage: string;
  commandSigned: any;
  openSignedCommand: any;
  isOpenSign: boolean;
  isDrawing: boolean = false;
  translationSubscribe: Subscription;
  currentLang: string;
  signedSubscription: Subscription;
  isReadCard: boolean;
  signedWidthIdCardImageSubscription: Subscription;
  conditionText: string = AgreementSignConstant.NEW_REGISTER_SIGN;
  webSocketEndpoint: string = environment.WEB_CONNECT_URL + '/SignaturePad';
  signature: boolean = false;
  signatureText: string = 'เซ็นลายเซ็น';
  // tslint:disable-next-line: max-line-length
  mockSignature: string = '<signature>' + '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' + '</signature>';
  signeturePath: string = 'IOS://param?Action=signature';
  imageSignature: string;
  imageSignatureBase64: string;
  img: any;
  isSuccess: boolean;
  action: number = 6;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private alertService: AlertService,
    private utils: Utils,
    private aisNativeDeviceService: AisNativeService,
    private shoppingCartService: ShoppingCartService,
    private removeCartService: RemoveCartService,
    private zone: NgZone
  ) {

    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.signedSubscription = this.aisNativeDeviceService.getSigned().subscribe((signature: string) => {
      this.captureAndSign.imageSignature = signature;
      this.onChangeCaptureAndSign();
    });

    if (this.isAisNative()) {
      this.signedWidthIdCardImageSubscription = this.aisNativeDeviceService.getCaptureSignatureWithCardImage()
        .subscribe((signatureWithCard: CaptureSignedWithCard) => {
          this.captureAndSign.imageSignature = signatureWithCard.signature;
          this.onChangeCaptureAndSign();
        });
    }

    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.checkJaymart();
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhumTelewiz();
    this.isReadCard = this.transaction.data.action === 'READ_CARD' ? true : false;
    this.checkCaptureAndSign();

    if (this.signatureText === 'แก้ไขลายเซ็น') {
      this.signature = false;
    }
    // this.onSignPad();

    // window.onSignatureCallback = (signature: any): void => {
    //   if (signature && signature.length > 0) {
    //     this.zone.run(() => {
    //       this.signature = true;
    //       this.signatureText = 'แก้ไขลายเซ็น';
    //       const parser: any = new DOMParser();
    //       const xmlDoc: any = parser.parseFromString(signature, 'text/xml');
    //       this.imageSignature = 'data:image/jpg;base64,' + xmlDoc.getElementsByTagName('signature')[0].firstChild.nodeValue + '';
    //       this.imageSignatureBase64 = xmlDoc.getElementsByTagName('signature')[0].firstChild.nodeValue + '';
    //       this.img = document.getElementById('imgPhoto');
    //       this.img.setAttribute('src', this.imageSignature);
    //       if (this.signatureText === 'แก้ไขลายเซ็น' && this.imageSignature) {
    //         this.isSuccess = true;
    //         this.transaction.data.customer.imageSignature = this.imageSignatureBase64;
    //       } else {
    //         this.isSuccess = false;
    //       }
    //     });
    //   }
    // };
  }

  checkJaymart(): void {
    const outChnSale = this.priceOption.queryParams.isRole;
    if (outChnSale && outChnSale && (outChnSale === 'RetailChain' || outChnSale === 'RetailChain')) {
      this.wizards = this.wizardJaymart;
      this.action = 5;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  checkCaptureAndSign(): void {
    const customer: Customer = this.transaction.data.customer;
    if (this.isReadCard) {
      this.captureAndSign = {
        allowCapture: false,
        imageSmartCard: customer.imageReadSmartCard,
        imageSignature: customer.imageSignature,
        imageSignatureWidthCard: customer.imageSignatureSmartCard
      };
    } else {
      this.captureAndSign = {
        allowCapture: true,
        imageSmartCard: customer.imageSmartCard,
        imageSignature: customer.imageSignature,
        imageSignatureWidthCard: customer.imageSignatureSmartCard
      };
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE]);
  }

  onNext(): void {
    const customer: Customer = this.transaction.data.customer;
    if (this.isReadCard) {
      customer.imageSignature = this.captureAndSign.imageSignature;
      customer.imageReadSmartCard = this.captureAndSign.imageSmartCard;
    } else {
      customer.imageSignature = this.captureAndSign.imageSignature;
      customer.imageSmartCard = this.captureAndSign.imageSmartCard;
      customer.imageSignatureSmartCard = this.captureAndSign.imageSignature;
      customer.imageSignatureWithWaterMark = this.captureAndSign.imageSignatureWidthCard;
    }
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.signedSubscription.unsubscribe();
    if (this.commandSigned) {
      this.commandSigned.ws.send('CaptureImage');
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  /////////// capture image //////////////

  onCameraCompleted(image: string): void {
    this.captureAndSign.imageSmartCard = image;
    this.createCanvas();
    this.onChangeCaptureAndSign();
  }

  onCameraError(error: string): void {
    this.onChangeCaptureAndSign();
    this.alertService.error(error);
    this.signed = false;
  }

  onClearImage(): void {
    this.captureAndSign.imageSmartCard = null;
    this.captureAndSign.imageSignatureWidthCard = null;
    this.captureAndSign.imageSignature = null;
    this.idCardValid = false;
    this.signed = false;
    this.clearCanvas();
    this.onChangeCaptureAndSign();
  }

  onSigned(): void {
     const user: User = this.tokenService.getUser();
     this.signed = false;
     this.apiSigned = ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'SignaturePad';
     if (this.isAisNative()) {
       this.aisNativeDeviceService.captureSignatureWithCardImage(null);
       return;
     }

     this.aisNativeDeviceService.openSigned(this.apiSigned).subscribe((command: any) => {
       this.commandSigned = command;
       if (command.error) {
         return;
       }
     });

    // if ('WebSocket' in window) {
    //   const _ws: any = new WebSocket(this.webSocketEndpoint);
    //   _ws.onopen = (() => {
    //     const message = '{Who:Customer,Why:Purchase}';
    //     _ws.send(message);
    //   });

    //   // Web socket get message
    //   _ws.onmessage = ((evt: any) => {
    //     this.signature = true;
    //     this.onGetMessage(evt.data);
    //   });

    //   // websocket is closed.
    //   _ws.onclose = (() => {
    //   });

    //   _ws.onerror = ((evt: any) => {
    //     this.alertService.error('ไม่สามารถเซ็นลายเซ็นได้ กรุณาตรวจสอบ AISWebConnect หรือติดต่อ 02-029-6303');
    //     if (environment.name !== 'prod' && environment.name !== 'sit') {
    //       window.onSignatureCallback(this.mockSignature);
    //     }
    //   });
    // } else {
    //   this.alertService.error('ไม่สามารถเซ็นลายเซ็นได้ กรุณาตรวจสอบ AISWebConnect หรือติดต่อ 02-029-6303');
    //   if (environment.name !== 'prod' && environment.name !== 'sit') {
    //     window.onSignatureCallback(this.mockSignature);
    //   }
    // }
  }

  openSignature(): void {
    if (window.iosNative) {
      window.location = this.signeturePath;
    } else {
      // this.aisNative.captureSignature();
    }
  }

  onGetMessage(data?: any): void {

  }

  isAisNative(): boolean {
    return !!window.aisNative;
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

  private onChangeCaptureAndSign(): void {
    if (this.isAisNative() && !this.hasImageSmartCard()) {
      this.camera.next();
    }
    this.setValid();
  }

  setValid(): void {
    let valid = false;
    if (this.isAllowCapture()) {
      valid = !!(this.captureAndSign.imageSmartCard && this.captureAndSign.imageSignature);
    } else {
      valid = !!(this.captureAndSign.imageSignature);
    }

    if (valid) {
      this.onCompleted();
    }
  }

  onCompleted(): void {
    this.signed = true;
    this.createCanvas();
    this.idCardValid = true;
  }
  // merge image //
  setDefaultCanvas(): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const imageSignatureWidthCard = new Image();

    imageSignatureWidthCard.src = 'data:image/png;base64,' + this.transaction.data.customer.imageSignatureSmartCard;

    imageSignatureWidthCard.onload = () => {
      if (new RegExp('data:image/png;base64,').test(imageSignatureWidthCard.src)) {
        canvas.width = imageSignatureWidthCard.width;
        canvas.height = imageSignatureWidthCard.height;
        ctx.drawImage(imageSignatureWidthCard, 0, 0);
      }
    };
  }

  createCanvas(): void {
    const imageCard = new Image();
    const signImage = new Image();
    const watermarkImage = new Image();

    imageCard.src = 'data:image/png;base64,' + this.captureAndSign.imageSmartCard;
    signImage.src = 'data:image/png;base64,' + this.captureAndSign.imageSignature;
    watermarkImage.src = 'data:image/png;base64,' + AWS_WATERMARK;

    if (!this.isReadCard) {
      imageCard.onload = () => {
        this.drawIdCardWithSign(imageCard, signImage, watermarkImage);
      };
      signImage.onload = () => {
        this.drawIdCardWithSign(imageCard, signImage, watermarkImage);
      };
    }

  }

  clearCanvas(): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  drawIdCardWithSign(imageCard?: any, signImage?: any, watermark?: any): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    let isDrawImage: boolean = false;
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (new RegExp('data:image/png;base64,').test(imageCard.src)) {
      canvas.width = imageCard.width;
      canvas.height = imageCard.height;
      isDrawImage = true;
      ctx.drawImage(imageCard, 0, 0);
    }

    if (this.signed) {
      if (new RegExp('data:image/png;base64,').test(signImage.src)) {
        if (!isDrawImage) {
          canvas.width = signImage.width;
          canvas.height = signImage.height;
        }

        const signImageRatio = (signImage.width / signImage.height) / 2;
        const signImageHeight = signImage.height > canvas.height ? canvas.height : signImage.height;
        const signImageWidth = signImageHeight * signImageRatio;

        const dxs = ((canvas.width - signImageWidth) / 2);
        const dys = ((canvas.height - signImageHeight) / 1.5);
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(signImage, dxs, dys, signImageWidth, signImageHeight);
        if (this.captureAndSign.imageSignature) {
          const watermarkRatio: number = (watermark.width / watermark.height);
          const watermarkHeight: number = watermark.height > signImage.height ? signImage.height : watermark.height;
          const watermarkWidth: number = watermarkHeight * watermarkRatio;
          const dxw = (canvas.width - watermarkWidth) / 2;
          const dyw = (canvas.height - watermarkHeight) / 2;
          // ctx.drawImage(watermark, dxw + 80, dyw + 40, watermarkWidth / 1.5, watermarkHeight / 1.5);
          ctx.drawImage(watermark, dxw + 70, dyw + 40, watermarkWidth / 1.87, watermarkHeight / 1.87);
        }
      }
    }
    this.captureAndSign.imageSignatureWidthCard = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');

    this.isDrawing = true;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit(): void {
    if (this.transaction.data.customer.imageSignatureSmartCard) {
      this.setDefaultCanvas();
    } else {
      this.createCanvas();
    }
    // this.onChangeCaptureAndSign();
    this.setValid();
  }

  takePicture(): void {
    console.log('1');
    this.camera.next();
  }

}
