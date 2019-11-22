import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE, ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE } from '../../constants/route-path.constant';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { CaptureAndSign, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Customer, FaceRecognition, TransactionAction } from 'src/app/shared/models/transaction.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-share-plan-mnp-face-compare-page',
  templateUrl: './new-share-plan-mnp-face-compare-page.component.html',
  styleUrls: ['./new-share-plan-mnp-face-compare-page.component.scss']
})
export class NewSharePlanMnpFaceComparePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  captureAndSign: CaptureAndSign;
  transaction: Transaction;

  constructor(
    private router: Router,
    private http: HttpClient,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();

  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CAPTURE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const customer: Customer = this.transaction.data.customer;
    const faceRecognition: FaceRecognition = this.transaction.data.faceRecognition;
    this.http.post('/api/facerecog/facecompare', {
      cardBase64Imgs: this.isReadCard() ? customer.imageReadSmartCard : (customer.imageSmartCard || customer.imageReadPassport),
      selfieBase64Imgs: faceRecognition.imageFaceUser
    }).toPromise()
      .then((resp: any) => {
        this.pageLoadingService.closeLoading();
        const isMatched: boolean = resp.data.isMatched;
        this.transaction.data.faceRecognition.kyc = isMatched;
        // tslint:disable-next-line: max-line-length
        isMatched === true ? this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_SELECT_NUMBER_PAGE]) : this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_FACE_CONFIRM_PAGE]);
      }).then(() => {
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  private isReadCard(): boolean {
    return this.transaction.data.action === TransactionAction.READ_CARD;
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
