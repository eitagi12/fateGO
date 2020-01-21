import { Component, OnInit, OnDestroy, EventEmitter, SimpleChanges, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE } from '../../constants/route-path.constant';
import { CaptureAndSign, TokenService, ChannelType, AisNativeService, AlertService, User, AWS_WATERMARK, CaptureSignedWithCard, Utils } from 'mychannel-shared-libs';
import { Customer, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
declare let window: any;
@Component({
  selector: 'app-new-share-plan-mnp-id-card-capture-page',
  templateUrl: './new-share-plan-mnp-id-card-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-id-card-capture-page.component.scss']
})
export class NewSharePlanMnpIdCardCapturePageComponent implements OnInit, OnDestroy {

  @ViewChild('signImage') signImage: ElementRef;
  camera: EventEmitter<void> = new EventEmitter<void>();
  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  user: User;
  customer: Customer;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;
  isDrawImageIdCard: boolean;
  onChangeValid: boolean = false;
  isNextValid: boolean;
  // Signature
  public isSignature: any = false;
  signedSubscription: Subscription;
  signedWidthIdCardImageSubscription: Subscription;
  commandSigned: any;
  apiSigned: 'SignaturePad' | 'OnscreenSignpad';
  isDrawingSignature: boolean = false;
  imageSigned: boolean;
  watermark: string = AWS_WATERMARK;
  count: number = 0;
  public ocrFlag: string;
  ocrMessage: string;
  ocrMessageShow: boolean;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private aisNativeDeviceService: AisNativeService,
    private utils: Utils,
    private http: HttpClient,
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();
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

  async onCameraCompleted(image: string): Promise<void> {
    this.captureAndSign.imageSmartCard = image;     // ได้รูปถ่ายบัตรปชช.
    await this.checkTypeOcr(image);
    this.createCanvas();
  }

  onCameraError(error: string): void {
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
      this.drawIdCardWithSign(imageCard, signImage);
    };
    // โหลดรูปภาพเซ็นลายเซ็นที่ได้จากการวาด
    signImage.onload = () => {
      this.drawIdCardWithSign(imageCard, signImage);
    };
  }

  drawIdCardWithSign(imageCard: any, signImage: any): void {
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
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.setImageSignature();
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  setImageSignature(): void {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignature = this.captureAndSign.imageSignature;
    customer.imageSmartCard = this.captureAndSign.imageSmartCard;
    customer.imageSignatureSmartCard = this.captureAndSign.imageSignatureWidthCard;
  }

  checkTypeOcr(imageOCR: string): any {
    const dataOcr: any = {
      machineId: '12345',
      command: 'classify',
      channel: 'mychannel',
      base64Image: imageOCR
    };
    return this.getResultTypeOcr(dataOcr)
      .then((res: any) => {
        this.ocrMessage = `${res.data.result} - ${res.data.message}`;
        const RESULT_IDCARD_NUMBER: number = 1100;
        if (this.count === 0) {
          if (res.data.result === RESULT_IDCARD_NUMBER) {
            this.ocrFlag = 'Y';
            this.isSignature = true;
            localStorage.setItem('OCRflag', this.ocrFlag);
          } else {
            this.alertService.error('ถ่ายรูปบัตรไม่ชัดเจน / ไม่ถูกต้อง<br>ท่านสามารถถ่ายรูปได้อีก 1 ครั้ง');
            this.isSignature = false;
            this.count++;
          }
        } else if (this.count === 1) {
          if (res.data.result === RESULT_IDCARD_NUMBER) {
            this.ocrFlag = 'Y';
            this.isSignature = true;
            localStorage.setItem('OCRflag', this.ocrFlag);
          } else {
            const errMsg = 'ภาพถ่ายไม่ชัดเจน กรุณายืนยัน และรับรองความถูกต้องก่อนทำรายการต่อไป';
            this.alertService.question(errMsg, 'ตกลง', 'ยกเลิก').then((response: any) => {
              if (response.value) {
                this.ocrFlag = 'N';
                localStorage.setItem('OCRflag', this.ocrFlag);
                this.isSignature = true;
              } else {
                window.location.href = '/sales-portal/dashboard';
              }
            });
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
    const queryOcrClassify: string = `/api/facerecog/ocrclassify`;
    return this.http.post(queryOcrClassify, ocrClassify).toPromise();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.signedSubscription.unsubscribe();
    if (this.commandSigned) {
      this.commandSigned.ws.send('CaptureImage');
    }
  }

}
