import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, Utils, AlertService, ImageUtils } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_ID_CARD_CAPTURE_PAGE,
  ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE,
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';

@Component({
  selector: 'app-omni-new-register-face-capture-page',
  templateUrl: './omni-new-register-face-capture-page.component.html',
  styleUrls: ['./omni-new-register-face-capture-page.component.scss']

})
export class OmniNewRegisterFaceCapturePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

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
    this.openCamera = !!(this.transaction.data.faceRecognition && this.transaction.data.faceRecognition.imageFaceUser);
  }

  onBack(): void {
    const action = this.transaction.data.action;
    if (action === 'READ_CARD') {
      window.location.href = `/sales-portal/reserve-stock/verify-omni-new-register`;
    } else {
      this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ID_CARD_CAPTURE_PAGE]);
    }
  }

  async onNext(): Promise<void> {
    await this.transactionService.update(this.transaction);
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_FACE_COMPARE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  onOpenCamera(): void {
    this.openCamera = true;
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
    this.transaction.data.faceRecognition.imageFaceUser = null;
  }

  public isAisNative(): boolean {
    return this.utils.isAisNative();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
