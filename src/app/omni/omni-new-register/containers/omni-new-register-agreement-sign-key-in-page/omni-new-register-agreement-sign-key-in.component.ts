import { Component, OnInit, OnDestroy, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import {
  HomeService,
  AisNativeService,
  User,
  TokenService,
  ChannelType,
  AlertService,
  CaptureAndSign,
  Utils,
  CaptureSignedWithCard,
  AWS_WATERMARK
} from 'mychannel-shared-libs';
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
  selector: 'app-omni-new-register-agreement-sign-key-in-page',
  templateUrl: './omni-new-register-agreement-sign-key-in.component.html',
  styleUrls: ['./omni-new-register-agreement-sign-key-in.component.scss']
})
export class OmniNewRegisterAgreementSignKeyInPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  @ViewChild('signImage') signImage: ElementRef;
  camera: EventEmitter<void> = new EventEmitter<void>();

  user: User;
  customer: Customer;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;
  isDrawImageIdCard: boolean;
  onChangeValid: boolean = false;
  isNextValid: boolean;
  isReadCard: boolean;
  // Signature
  signedSubscription: Subscription;
  signedWidthIdCardImageSubscription: Subscription;
  commandSigned: any;
  apiSigned: 'SignaturePad' | 'OnscreenSignpad';
  isDrawingSignature: boolean = false;
  imageSigned: boolean;
  watermark: string = AWS_WATERMARK;

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
  }

  ngOnInit(): void {
    this.getImageSignature();
    this.getCaptureAndSign();
    this.setShowImageFromTransaction();
  }

  getImageSignature(): void {
    this.signedSubscription = this.aisNativeDeviceService.getSigned()
      .subscribe((signature: string) => {
        this.captureAndSign.imageSignature = signature;
        this.onCheckCaptureAndSign();
      });
    if (this.isAisNative()) {
      this.signedWidthIdCardImageSubscription = this.aisNativeDeviceService.getCaptureSignatureWithCardImage()
        .subscribe((signatureWithCard: CaptureSignedWithCard) => {
          this.captureAndSign.imageSignature = signatureWithCard.signature;
          this.onCheckCaptureAndSign();
        });
    }
  }

  setShowImageFromTransaction(): void {
    const customer: Customer = this.transaction.data.customer;
    if (customer && customer.imageSignature && customer.imageSmartCard) {
      this.onCheckCaptureAndSign();
    }
  }

  getCaptureAndSign(): void {
    const customer: Customer = this.transaction.data.customer;
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: customer.imageSmartCard,
      imageSignature: customer.imageSignature,
      imageSignatureWidthCard: null
    };
  }

  isAllowCapture(): boolean {
    return this.captureAndSign.allowCapture;
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  hasImageSmartCard(): boolean {
    return !!this.captureAndSign.imageSmartCard;
  }

  hasImageSignature(): boolean {
    return !!this.captureAndSign.imageSignature;
  }

  onCameraCompleted(image: string): void {
    this.captureAndSign.imageSmartCard = image;     // ได้รูปถ่ายบัตรปชช.
    this.createCanvas();
  }

  onCameraError(error: string): void {
    this.alertService.error(error);
    this.imageSigned = false;
  }

  createCanvas(): void {
    const imageCard = new Image();          // สร้าง imageCard เพื่อหา src ของรูปถ่ายบัตรปชช.
    const signImage = new Image();          // สร้าง imageCard เพื่อหา src ของรูปลายเซ็น
    const watermarkImage = new Image();     // สร้าง imageCard เพื่อหา src ของรูปลายน้ำ

    // รูปถ่ายบัตรปชช, รูปลายเซ็น, รูปลายน้ำ
    imageCard.src = (this.captureAndSign.imageSmartCard) ? 'data:image/png;base64,' + this.captureAndSign.imageSmartCard : '';
    signImage.src = (this.captureAndSign.imageSignature) ? 'data:image/png;base64,' + this.captureAndSign.imageSignature : '';
    watermarkImage.src = 'data:image/png;base64,' + AWS_WATERMARK;

    // โหลดรูปภาพบัตรปชช.ที่ได้จากการวาด
    imageCard.onload = () => {
      this.drawIdCardWithSign(imageCard, signImage, watermarkImage);
    };
    // โหลดรูปภาพเซ็นลายเซ็นที่ได้จากการวาด
    signImage.onload = () => {
      this.drawIdCardWithSign(imageCard, signImage, watermarkImage);
    };
  }

  drawIdCardWithSign(imageCard: any, signImage: any, watermark?: any): void {
    // สร้างตัวแปรเก็บชนิดรูปจากบัตรปชช./รูปลายเซ็นเป็น Canvas เพื่อให้เรียกใช้อันเดียวกับแท็กบน html
    // สร้างตัวแปรเก็บตำแหน่ง แกน x, y ของรูปบัตรปชช./รูปลายเซ็น
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    this.isDrawImageIdCard = false;   // เช็คว่ามีการวาดรูปถ่ายบัตรปชช.หรือยัง

    // ลบส่วนเกินของรูปภาพออกและทำให้ภาพเป็นพื้นหลังโปร่งใส
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // หารูปถ่ายบัตรปชช.
    if (new RegExp('data:image/png;base64,').test(imageCard.src)) {
      canvas.width = imageCard.width;
      canvas.height = imageCard.height;
      this.isDrawImageIdCard = true;
      ctx.drawImage(imageCard, 0, 0);
    }

    // เช็คว่าเซ็นลายเซ็นหรือยัง
    if (this.imageSigned) {
      // หารูปเซ็นลายเซ็น
      if (new RegExp('data:image/png;base64,').test(signImage.src)) {
        if (!this.isDrawImageIdCard) {
          canvas.width = signImage.width;
          canvas.height = signImage.height;
        }

        // ปรับตำแหน่งให้รูปลายเซ็นอยู่ตรงกลาง
        const signImageRatio = (signImage.width / signImage.height) / 2;
        const signImageHeight = signImage.height > canvas.height ? canvas.height : signImage.height;
        const signImageWidth = signImageHeight * signImageRatio;

        // หาจุดเริ่มต้นของภาพลายเซ็นที่จะวาด
        const dxs = ((canvas.width - signImageWidth) / 2);
        const dys = ((canvas.height - signImageHeight) / 2) / 6;

        ctx.globalCompositeOperation = 'multiply';                            // ทำให้รูปลายเซ็นทับรูปถ่ายบัตรปชช.
        ctx.drawImage(signImage, dxs, dys, signImageWidth, signImageHeight);  // เริ่มวาดรูปตั้งแต่จุดเริ่มต้นของภาพ
        ctx.drawImage(watermark, 0, 0, canvas.width, canvas.height);
      }
    }
    // ได้รูปภาพทีมีรูปถ่ายจากบัตรปชช.พร้อมลายเซ็นที่ทับกัน
    this.captureAndSign.imageSignatureWidthCard = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
    this.isDrawingSignature = true;
  }

  // เช็คว่าถ้ากดถ่ายรูปใหม่ จะต้องได้รูปถ่ายบัตรปชช. และรูปลายเซ็น
  onCheckCaptureAndSign(): void {
    if (this.isAisNative() && !this.hasImageSmartCard()) {
      this.camera.next();
    }

    if ((this.isAllowCapture()) && (this.captureAndSign.imageSmartCard && this.captureAndSign.imageSignature)) {
      this.createCanvas();
      this.onChangeValid = true;
      this.imageSigned = true;
      this.isNextValid = true;
    } else {
      this.onChangeValid = false;
    }
  }

  // เคลียร์รูปภาพตอนกดถ่ายรูปใหม่
  onClearImage(): void {
    this.captureAndSign.imageSmartCard = null;
    this.captureAndSign.imageSignatureWidthCard = null;
    this.captureAndSign.imageSignature = null;
    this.isNextValid = false;
    this.imageSigned = false;
    this.clearCanvas();
  }

  // เคลียร์รูปภาพ(สร้าง canvas) ตอนกดถ่ายรูปใหม่
  clearCanvas(): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // get library signpad
  onSigned(): void {
    this.imageSigned = false;
    this.user = this.tokenService.getUser();

    // เรียก library signed ของ Native/PC
    if (this.isAisNative()) {
      this.aisNativeDeviceService.captureSignatureWithCardImage(null);
      return;
    } else {
      this.apiSigned = ChannelType.SMART_ORDER === this.user.channelType ? 'OnscreenSignpad' : 'SignaturePad';
      this.aisNativeDeviceService.openSigned(this.apiSigned).subscribe((command: any) => {
        this.commandSigned = command;
        if (command.error) {
          return;
        }
      });
    }
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

  setImageSignature(): void {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignature = this.captureAndSign.imageSignature;
    customer.imageSmartCard = this.captureAndSign.imageSmartCard;
    customer.imageSignatureSmartCard = this.captureAndSign.imageSignatureWidthCard;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.signedSubscription.unsubscribe();
    if (this.commandSigned) {
      this.commandSigned.ws.send('CaptureImage');
    }
  }
}
