import { Component, OnInit, OnDestroy, EventEmitter, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE } from '../../constants/route-path.constant';
import { CaptureAndSign, TokenService, ChannelType, HomeService, AisNativeService, AlertService, User, AWS_WATERMARK, CaptureSignedWithCard } from 'mychannel-shared-libs';
import { Customer, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Subscription } from 'rxjs';
declare let window: any;
@Component({
  selector: 'app-new-share-plan-mnp-id-card-capture-page',
  templateUrl: './new-share-plan-mnp-id-card-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-id-card-capture-page.component.scss']
})
export class NewSharePlanMnpIdCardCapturePageComponent implements OnInit, OnDestroy {
  @ViewChild('signImage') signImage: ElementRef;      // ประกาศตัวแปรอ้างอิงจากแท็กบน html (ใช้ภาษา Angular)

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  user: User;
  customer: Customer;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;
  camera: EventEmitter<void> = new EventEmitter<void>();
  isDrawImageIdCard: boolean;
  isReadCard: boolean;
  onChangeValid: boolean = false;
  isNextValid: boolean;
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
    private aisNativeService: AisNativeService,
    private alertService: AlertService,
    private aisNativeDeviceService: AisNativeService
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();

    // เรียกกล้องของ PC
    this.signedSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
      this.captureAndSign.imageSignature = signature;
      this.onChangeCaptureAndSign();
    });

    // เรียกกล้องของ Native
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

    // เช็คว่า เมื่อกดปุ่ม Back กลับมาให้โชว์รูปลายเซ็น
    if (this.transaction.data.customer.imageSignatureSmartCard) {
      this.setDefaultCanvas();
    } else {
      this.createCanvas();
    }
    this.onChangeCaptureAndSign();
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
        allowCapture: true,                            // เปิดกล้อง
        imageSmartCard: customer.imageSmartCard,       // รูปถ่ายบัตรปชช.
        imageSignature: customer.imageSignature,       // รูปลายเซ็น
        imageSignatureWidthCard: null                  // รูปถ่ายบัตรปชช.ทับรูปลายเซ็น
      };
    }
  }

  isAllowCapture(): boolean {
    return this.captureAndSign.allowCapture;
  }

  isAisNative(): boolean {
    return !!window.aisNative;
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
    this.onChangeCaptureAndSign();
  }

  onCameraError(error: string): void {
    this.onChangeCaptureAndSign();
    this.alertService.error(error);
    this.imageSigned = false;
  }

  // วาดรูปลายเซ็นหลังจากกดปุ่ม Back กลับมาหน้าถ่ายรูปบัตรปชช.
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
    const imageCard = new Image();          // สร้าง imageCard เพื่อหา src ของรูปถ่ายบัตรปชช.
    const signImage = new Image();          // สร้าง imageCard เพื่อหา src ของรูปลายเซ็น
    const watermarkImage = new Image();     // สร้าง imageCard เพื่อหา src ของรูปลายน้ำ

    imageCard.src = 'data:image/png;base64,' + this.captureAndSign.imageSmartCard;    // รูปถ่ายบัตรปชช.
    signImage.src = 'data:image/png;base64,' + this.captureAndSign.imageSignature;    // รูปลายเซ็น
    watermarkImage.src = 'data:image/png;base64,' + AWS_WATERMARK;                    // รูปลายน้ำ

    if (!this.isReadCard) {
      // โหลดรูปภาพบัตรปชช.ที่ได้จากการวาด
      imageCard.onload = () => {
        this.drawIdCardWithSign(imageCard, signImage, watermarkImage);
      };
      // โหลดรูปภาพเซ็นลายเซ็นที่ได้จากการวาด
      signImage.onload = () => {
        this.drawIdCardWithSign(imageCard, signImage, watermarkImage);
      };
    }
  }

  drawIdCardWithSign(imageCard: any, signImage: any, watermarkImage: any): void {
    // สร้างตัวแปรเก็บชนิดรูปจากบัตรปชช./รูปลายเซ็นเป็น Canvas เพื่อให้เรียกใช้อันเดียวกับแท็กบน html
    // สร้างตัวแปรเก็บตำแหน่ง แกน x, y ของรูปบัตรปชช./รูปลายเซ็น
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    this.isDrawImageIdCard = false;   // เช็คว่ามีการวาดรูปถ่ายบัตรปชช.หรือยัง

    // ลบส่วนเกินทีของรูปภาพออกและทำให้ภาพเป็นพื้นหลังโปร่งใส
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // วาดรูปถ่ายบัตรปชช./รูปลายเซ็น (วาดตามตำแหน่งของแกน x,y ของรูปถ่ายบัตรปชช./รูปลายเซ็น)
    if (new RegExp('data:image/png;base64,').test(imageCard.src)) {
      canvas.width = imageCard.width;
      canvas.height = imageCard.height;
      this.isDrawImageIdCard = true;
      ctx.drawImage(imageCard, 0, 0);
    }

    if (this.imageSigned === true) {
      if (new RegExp('data:image/png;base64,').test(signImage.src)) {
        if (!this.isDrawImageIdCard) {
          canvas.width = signImage.width;
          canvas.height = signImage.height;
        }

        // ปรับตำแหน่งให้รูปลายเซ็นอยู่ตรงกลาง
        const signImageRatio = (signImage.width / signImage.height) / 2;
        const signImageHeight = signImage.height > canvas.height ? canvas.height : signImage.height;
        const signImageWidth = signImageHeight * signImageRatio;

        // หาจุดเริ่มต้นของภาพทีลายเซ็นที่จะวาด
        const dxs = ((canvas.width - signImageWidth) / 2);
        const dys = ((canvas.height - signImageHeight) / 2) / 6;

        ctx.globalCompositeOperation = 'multiply';        // ทำให้รูปลายเซ็นทับรูปถ่ายบัตรปชช.
        ctx.drawImage(signImage, dxs, dys, signImageWidth, signImageHeight);
      }
    }
    this.captureAndSign.imageSignatureWidthCard = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
    this.isDrawingSignature = true;
  }

  // เช็คว่าถ้ากดถ่ายรูปใหม่ จะต้องได้รูปถ่ายบัตรปชช. และรูปลายเซ็น
  onChangeCaptureAndSign(): void {
    if (this.isAisNative() && !this.hasImageSmartCard()) {
      this.camera.next();
    }
    if (this.isAllowCapture()) {
      this.onChangeValid = !!(this.captureAndSign.imageSmartCard && this.captureAndSign.imageSignature);
    } else {
      this.onChangeValid = !!(this.captureAndSign.imageSignature);
    }

    if (this.onChangeValid === true) {
      this.onChangeImageCompleted();
    } else {
      this.onChangeImageError();
    }
  }

  // กดถ่ายรูปใหม่และเซ็นลายเซ็นเสร็จแล้ว
  onChangeImageCompleted(): void {
    this.imageSigned = true;
    this.createCanvas();
    this.isNextValid = true;
  }

  // กดถ่ายรูปใหม่แต่ยังไม่ได้เซ็นลายเซ็น
  onChangeImageError(): void {
    this.isNextValid = false;
  }

  // เคลียร์รูปภาพตอนกดถ่ายรูปใหม่
  onClearImage(): void {
    this.captureAndSign.imageSmartCard = null;
    this.captureAndSign.imageSignatureWidthCard = null;
    this.captureAndSign.imageSignature = null;
    this.isNextValid = false;
    this.imageSigned = false;
    this.clearCanvas();
    this.onChangeCaptureAndSign();
  }

  // เคลียร์รูปภาพ(สร้าง canvas) ตอนกดถ่ายรูปใหม่
  clearCanvas(): void {
    const canvas: HTMLCanvasElement = (<HTMLCanvasElement>this.signImage.nativeElement);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  onSigned(): void {
    this.imageSigned = false;
    this.user = this.tokenService.getUser();
    // เป็นการเช็คเพื่อส่งค่าและเรียก library Signed ของ Native/PC
    this.apiSigned = ChannelType.SMART_ORDER === this.user.channelType ? 'OnscreenSignpad' : 'SignaturePad';

    // เรียก library Signed ของ Native
    if (this.isAisNative()) {
      this.aisNativeDeviceService.captureSignatureWithCardImage(null);
      return;
    }

    // เรียก library Signed ของ PC
    this.aisNativeDeviceService.openSigned(this.apiSigned).subscribe((command: any) => {
      this.commandSigned = command;
      if (command.error) {
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.signedSubscription.unsubscribe();
    if (this.commandSigned) {
      this.commandSigned.ws.send('CaptureImage');
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.setImageSignature();
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  setImageSignature(): void {
    const customer: Customer = this.transaction.data.customer;
    if (this.isReadCard) {
      customer.imageSignature = this.captureAndSign.imageSignature;
      customer.imageReadSmartCard = this.captureAndSign.imageSmartCard;
    } else {
      customer.imageSignature = this.captureAndSign.imageSignature;
      customer.imageSmartCard = this.captureAndSign.imageSmartCard;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
