import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, CaptureAndSign, TokenService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_ORDER_NEW_REGISTER_FACE_CONFIRM_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, TransactionAction, Customer, FaceRecognition } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order-new-register-face-compare-page',
  templateUrl: './order-new-register-face-compare-page.component.html',
  styleUrls: ['./order-new-register-face-compare-page.component.scss']
})
export class OrderNewRegisterFaceComparePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  captureAndSign: CaptureAndSign;

  transaction: Transaction;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService,

  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // const faceImage = this.faceRecognitionService.getFaceImage();
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const customer: Customer = this.transaction.data.customer;
    const faceRecognition: FaceRecognition = this.transaction.data.faceRecognition;

    this.http.post('/api/facerecog/facecompare', {
      cardBase64Imgs: this.isReadCard() ? customer.imageReadSmartCard : (customer.imageSmartCard || customer.imageReadPassport),
      selfieBase64Imgs: faceRecognition.imageFaceUser
    }).toPromise().then((resp: any) => {
      this.transaction.data.faceRecognition.kyc = !resp.data.match;
      if (resp.data.match) {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SELECT_NUMBER_PAGE]);
      } else {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CONFIRM_PAGE]);
      }
    }).then(() => {
      this.pageLoadingService.closeLoading();
    }).catch((error) => {
      this.pageLoadingService.closeLoading();
      this.transaction.data.faceRecognition.kyc = true;
      this.router.navigate([ROUTE_ORDER_NEW_REGISTER_FACE_CONFIRM_PAGE]);
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  isReadCard(): boolean {
    return this.transaction.data.action === TransactionAction.READ_CARD;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
