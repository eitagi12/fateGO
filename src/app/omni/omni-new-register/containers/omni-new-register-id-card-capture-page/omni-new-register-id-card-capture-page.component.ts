import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, CaptureAndSign, TokenService, ChannelType, AlertService, Utils } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE,
  ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';

@Component({
  selector: 'app-omni-new-register-id-card-capture-page',
  templateUrl: './omni-new-register-id-card-capture-page.component.html',
  styleUrls: ['./omni-new-register-id-card-capture-page.component.scss']
})
export class OmniNewRegisterIdCardCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;
  apiSigned: string;
  idCardValid: boolean;
  openCamera: boolean = true;
  camera: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private utils: Utils,
  ) {
    this.transaction = this.transactionService.load();

    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.apiSigned = 'OnscreenSignpad';
    } else {
      this.apiSigned = 'SignaturePad';
    }
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: customer.imageSmartCard,
      imageSignature: customer.imageSignatureSmartCard
    };
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    // this.transaction.data.customer.imageSmartCard = captureAndSign.imageSmartCard;
  const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onError(valid: boolean): void {
    this.idCardValid = valid;
  }

  onBack(): void {
    this.onClearIdCardImage();
    // tslint:disable-next-line: max-line-length
    if (this.transaction.data.customer.caNumber && this.transaction.data.customer.caNumber !== '' && this.transaction.data.action === TransactionAction.READ_CARD) {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE]);
    // tslint:disable-next-line: max-line-length
    } else if (this.transaction.data.customer.caNumber && this.transaction.data.customer.caNumber === '' && this.transaction.data.action === TransactionAction.READ_CARD) {
      // this.router.navigate([ROUTE_OMNI_NEW_REGISTER_CUSTOMER_INFO_PAGE]); route to mc หน้ารับสินค้า
  } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE]);
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onCameraCompleted(image: string): void {
    this.transaction.data.customer.imageSmartCard = image;
  }

  onCameraError(error: string): void {
    this.alertService.error(error);
  }

  onClearIdCardImage(): void {
    this.transaction.data.customer.imageSmartCard = null;
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  onOpenCamera(): void {
    this.openCamera = true;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
