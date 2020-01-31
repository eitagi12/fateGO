import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, User, TokenService, ChannelType, AlertService, CaptureAndSign, Utils, CaptureSignedWithCard, AWS_WATERMARK } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Transaction, Customer } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { AgreementSignConstant } from '../../constants/agreement-sign.constant';
declare let window: any;
@Component({
  selector: 'app-omni-new-register-agreement-sign-page',
  templateUrl: './omni-new-register-agreement-sign-page.component.html',
  styleUrls: ['./omni-new-register-agreement-sign-page.component.scss']
})
export class OmniNewRegisterAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  /// convert sign image
  @ViewChild('signImage') signImage: ElementRef;
  signed: boolean = false;

  transaction: Transaction;
  // captureAndSign
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
  // conditionText: string = AgreementSignConstant.NEW_REGISTER_SIGN;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private alertService: AlertService,
    private utils: Utils,
    private aisNativeDeviceService: AisNativeService
  ) {

    this.transaction = this.transactionService.load();
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
  }

  ngOnInit(): void {
    this.isReadCard = this.transaction.data.action === 'READ_CARD' ? true : false;
    this.checkCaptureAndSign();
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

  onError(valid: boolean): void {
    this.idCardValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
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
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE]);
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
          ctx.drawImage(watermark, dxw + 280, dyw + 190, watermarkWidth / 3.0, watermarkHeight / 3.0);
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
  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.signedSubscription.unsubscribe();
    if (this.commandSigned) {
      this.commandSigned.ws.send('CaptureImage');
    }
  }
}
