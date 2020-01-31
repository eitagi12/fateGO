import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService, TokenService, PageLoadingService, REGEX_MOBILE, AlertService, User } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_AGGREGATE_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_RESULT_PAGE
} from '../../constants/route-path.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-new-register-mnp-queue-page',
  templateUrl: './new-register-mnp-queue-page.component.html',
  styleUrls: ['./new-register-mnp-queue-page.component.scss']
})
export class NewRegisterMnpQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  _queueFrom: FormGroup;
  locationCode: string;
  user: User;
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
    private removeCartService: RemoveCartService,
  ) {
    this.locationCode = tokenService.getUser().locationCode;
    this.priceOption = priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.user = tokenService.getUser();
  }

  ngOnInit(): void {
    this.saveFaceImage();
    this.createForm();
  }

  createForm(): void {
    const REGEX_QUEUE = /^[A-Z][0-9]{3}?$/;
    this._queueFrom = new FormGroup({
      queueNo: new FormControl('', [Validators.required, Validators.pattern(REGEX_QUEUE)])
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_AGGREGATE_PAGE]);
  }

  onNext(): Promise<any> {
    this.pageLoadingService.openLoading();
    this.transaction.data.queue = {
      queueNo: this._queueFrom.value.queueNo ? this._queueFrom.value.queueNo : ''
    };
    return this.queuePageService.createDeviceSellingOrderListSPKASP(this.transaction, this.priceOption, this.user).then((res: any) => {
    }).then((res: any) => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
      }).then((res: any) => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_RESULT_PAGE]);
      }).catch((err) => {
        this.pageLoadingService.closeLoading();
        if (err.error && err.error.developerMessage) {
          this.alertService.error(err.error.developerMessage);
        }
      });
  }

  onSkip(): void {
    this.pageLoadingService.openLoading();
    if (this.locationCode) {
      this.queuePageService.getQueueAspAndTelewiz(this.locationCode)
        .then((res: any) => {
          this.transaction.data.queue = {
            queueNo: res.data.queue ? res.data.queue : ''
          };
        })
        .then(() => {
          return this.queuePageService.createDeviceSellingOrderListSPKASP(this.transaction, this.priceOption, this.user) // New Service Que
            .then((res: any) => {
              return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption);
            });
        })
        .then((res) => {
          this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_RESULT_PAGE]);
        })
        .then(() => this.pageLoadingService.closeLoading());
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
