import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_BLOCK_CHAIN } from 'src/app/omni/constants/wizard.constant';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, ImageUtils, Setting } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_OMNI_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE, ROUTE_OMNI_BLOCK_CHAIN_FACE_COMPARE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-omni-block-chain-face-capture-page',
  templateUrl: './omni-block-chain-face-capture-page.component.html',
  styleUrls: ['./omni-block-chain-face-capture-page.component.scss']
})

export class OmniBlockChainFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_BLOCK_CHAIN;
  settings: Setting;
  openCamera: boolean = false;
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
    this.settings = {
      cameraFuntionName: 'faceTracker',
      countdown: 5,
      crop: true,
    };

    if (this.transaction && this.transaction.data &&
      this.transaction.data.faceRecognition) {
      delete this.transaction.data.faceRecognition.imageFaceUser;
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_BLOCK_CHAIN_AGREEMENT_SIGN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_BLOCK_CHAIN_FACE_COMPARE_PAGE]);
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
