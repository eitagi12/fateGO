import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService, TokenService, PageLoadingService, REGEX_MOBILE, AlertService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_RESULT_PAGE } from '../../constants/route-path.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { forEach } from '@angular/router/src/utils/collection';
import { RemoveCartService } from '../../services/remove-cart.service';

@Component({
  selector: 'app-new-register-mnp-queue-page',
  templateUrl: './new-register-mnp-queue-page.component.html',
  styleUrls: ['./new-register-mnp-queue-page.component.scss']
})
export class NewRegisterMnpQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private queuePageService: QueuePageService,
    private sharedTransactionService: SharedTransactionService,
    private alertService: AlertService,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.saveFaceImage();
    this.createForm();
  }

  createForm(): void {
    const REGEX_QUEUE = /^[A-Z][0-9]{3}?$/;
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'queueNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_QUEUE)])],
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGGREGATE_PAGE]);
  }

  onNext(queue: boolean): void {
    this.pageLoadingService.openLoading();
    if (queue) {
      this.queuePageService.autoGetQueue(this.queueFrom.value.mobileNo)
        .then((queueNo: any) => {
          const data = queueNo || {};
          return data;
        })
        .then((queueNo: string) => {
          this.transaction.data.queue = {
            queueNo: queueNo
          };
          return this.queuePageService.createDeviceSellingOrderList(this.transaction, this.priceOption) // New Service Que
            .then(() => {
              return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
            });
        })
        .then((res) => {
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_RESULT_PAGE]);
        })
        .then(() => this.pageLoadingService.closeLoading());
    } else {
      this.transaction.data.queue = {
        queueNo: this.queueFrom.value.queueNo
      };

      this.queuePageService.createDeviceSellingOrderList(this.transaction, this.priceOption)
        .then(() => {
          return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
            this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_RESULT_PAGE]);
          }).then(() => this.pageLoadingService.closeLoading());
        });
    }
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  saveFaceImage(): any {
    const user = this.tokenService.getUser();
    const customer = this.transaction.data.customer;
    const faceRecognition = this.transaction.data.faceRecognition;
    const mobileNo = this.transaction.data.simCard.mobileNo;
    const action = this.transaction.data.action;
    const channelKyc = this.transaction.data.faceRecognition.kyc;
    let channel = 'MC';
    if (channelKyc) {
      channel += '_KYC';
    }
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      channel += '_PT';
    } else {
      channel += '_SM';
    }
    let base64Card: any;
    if (action === TransactionAction.READ_CARD) {
      base64Card = customer.imageReadSmartCard;
    } else if (action === TransactionAction.READ_PASSPORT) {
      base64Card = customer.imageReadPassport;
    } else {
      base64Card = customer.imageSmartCard;
    }
    const param: any = {
      userId: user.username,
      locationCode: user.locationCode,
      idCardType: customer.idCardType === 'บัตรประชาชน' ? 'Thai National ID' : 'OTHER',
      customerId: customer.idCardNo || '',
      mobileNo: mobileNo || '',
      base64Card: base64Card ? `data:image/jpg;base64,${base64Card}` : '',
      base64Face: faceRecognition.imageFaceUser ? `data:image/jpg;base64,${faceRecognition.imageFaceUser}` : '',
      channel: channel,
      userchannel: 'MyChannel'
    };
    this.http.post('/api/facerecog/save-imagesV2', param).toPromise()
      .catch(e => {
        console.log(e);
        Promise.resolve(null);
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
