import { Component, OnInit, OnDestroy, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE } from '../../constants/route-path.constant';
import { CaptureAndSign, TokenService, ChannelType, HomeService, AisNativeService, AlertService, Utils, User, AWS_WATERMARK } from 'mychannel-shared-libs';
import { Customer, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-share-plan-mnp-id-card-capture-page',
  templateUrl: './new-share-plan-mnp-id-card-capture-page.component.html',
  styleUrls: ['./new-share-plan-mnp-id-card-capture-page.component.scss']
})
export class NewSharePlanMnpIdCardCapturePageComponent implements OnInit, OnDestroy, OnChanges {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  public captureAndSign: CaptureAndSign;
  public apiSigned: string;
  public transaction: Transaction;
  public customer: Customer;
  public idCardValid: boolean;
  public signedSubscription: Subscription;
  public camera: EventEmitter<void> = new EventEmitter<void>();
  public isValid: boolean;
  public user: User;
  public watermark: string = AWS_WATERMARK;
  public isOpenSign: any = true;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private aisNativeService: AisNativeService,
    private alertService: AlertService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    this.user = this.tokenService.getUser();

    this.signedSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
      this.captureAndSign.imageSignature = signature;
      this.onChangeCaptureAndSign();
    });
  }

  ngOnInit(): void {
    this.checkSignpad();
    this.getCustomer();
    this.getCaptureAndSign();
    this.checkImageFromTransaction();
  }

  private checkSignpad(): string {
    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      return this.apiSigned = 'OnscreenSignpad';
    } else {
      return this.apiSigned = 'SignaturePad';
    }
  }

  private getCaptureAndSign(): void {
    this.getCustomer();
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: this.customer.imageSmartCard,
      imageSignature: this.customer.imageSignatureSmartCard
    };
  }

  private getCustomer(): Customer {
    return this.customer = this.transaction.data.customer;
  }

  private onChangeCaptureAndSign(): void {
    this.isValid = false;
    if (this.isAllowCapture() === true) {
      if (this.captureAndSign.imageSmartCard && this.captureAndSign.imageSignature) {
        this.isValid = true;
      } else {
        this.captureAndSign.imageSignature = undefined;
        this.customer.imageSignatureSmartCard = undefined;
        this.isValid = false;
      }
    }
    this.checkVerifyNext(this.isValid);
  }

  private checkVerifyNext(isValid: boolean): void {
    if (this.isValid === true) {
      this.idCardValid = true;
      this.onCompleted(this.captureAndSign);
    } else {
      this.onError(isValid);
    }
  }

  private checkImageFromTransaction(): void {
    if (this.customer && this.customer.imageSmartCard && this.customer.imageSignatureSmartCard) {
      this.checkVerifyNext(true);
    } else {
      this.checkVerifyNext(false);
    }
  }

  private onCompleted(captureAndSign: CaptureAndSign): void {
    this.customer.imageSmartCard = captureAndSign.imageSmartCard;
    this.customer.imageSignatureSmartCard = captureAndSign.imageSignature;
  }

  private onError(isValid: boolean): void {
    this.idCardValid = isValid;
  }

  public onCameraCompleted(image: string): void {
    this.captureAndSign.imageSmartCard = image;
    this.onChangeCaptureAndSign();
  }

  public onCameraError(error: string): void {
    this.onChangeCaptureAndSign();
    this.alertService.error(error);
  }

  public onClearImage(): void {
    this.captureAndSign.imageSmartCard = null;
    this.onChangeCaptureAndSign();
  }

  public onSigned(): void {
    this.checkSignpad();
    this.aisNativeService.openSigned(this.apiSigned ? 'OnscreenSignpad' : 'SignaturePad').subscribe();
  }

  public isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  public isAllowCapture(): boolean {
    return this.captureAndSign.allowCapture;
  }

  public hasImageSmartCard(): boolean {
    return (this.captureAndSign && this.captureAndSign.imageSmartCard) ? true : false;
  }

  public hasImageSignature(): boolean {
    return (this.captureAndSign && this.captureAndSign.imageSignature) ? true : false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.captureAndSign) {
      this.onChangeCaptureAndSign();
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
    this.signedSubscription.unsubscribe();
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_CUSTOMER_INFO_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
