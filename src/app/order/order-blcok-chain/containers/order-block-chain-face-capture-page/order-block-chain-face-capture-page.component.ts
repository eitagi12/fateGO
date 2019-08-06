import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, ImageUtils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE, ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-order-new-register-esim-shop-face-capture-page',
  templateUrl: './order-new-register-esim-shop-face-capture-page.component.html',
  styleUrls: ['./order-new-register-esim-shop-face-capture-page.component.scss']
})
export class OrderNewRegisterEsimShopFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

  openCamera: boolean;
  transaction: Transaction;
  camera: EventEmitter<void> = new EventEmitter<void>();
  isCaptureSuccess: boolean = false;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private utils: Utils,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    if (this.transaction && this.transaction.data &&
      this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser) {
      delete this.transaction.data.faceRecognition.imageFaceUser;
    }
    this.openCamera = !!(this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser);
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_COMPARE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenCamera(): void {
    this.openCamera = true;
  }

  switchLanguage(lang: string): void {
    // this.i18nService.setLang(lang);
  }

  onCameraCompleted(image: string): void {
    this.isCaptureSuccess = image ? true : false;
    this.transaction.data.faceRecognition = {
      imageFaceUser: image
    };
  }

  onCameraError(error: string): void {
    this.alertService.error(this.translation.instant(error));
  }

  onClearIdCardImage(): void {
    this.isCaptureSuccess = false;
    this.transaction.data.faceRecognition.imageFaceUser = null;
  }

  isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
