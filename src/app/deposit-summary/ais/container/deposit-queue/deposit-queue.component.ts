import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AlertService, User, TokenService } from 'mychannel-shared-libs';
import { DEPOSIT_RESULT_PAGE, DEPOSIT_PAYMENT_SUMMARY_PAGE} from '../../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateDeviceOrderService } from '../../../services/create-device-order.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { QueuePageService } from 'src/app/deposit-summary/services/queue-page.service';

@Component({
  selector: 'app-deposit-queue',
  templateUrl: './deposit-queue.component.html',
  styleUrls: ['./deposit-queue.component.scss']
})
export class DepositQueueComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  mobileFrom: FormGroup;
  queueFrom: FormGroup;
  queue: string;
  user: User;
  mobileNo: string;
  queueType: string;
  inputType: string;
  errorQueue: boolean = false;
  skipQueue: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private createOrderService: CreateDeviceOrderService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private queuePageService: QueuePageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.setQueueType();
    this.createForm();
  }

  setQueueType(): void {
    this.queuePageService.checkQueueLocation().then((queueType) => {
      this.queueType = queueType;
    }).then(() => this.createForm());
  }

  checkInput(event: any, type: string): void {
    this.inputType = type;
    if (type === 'mobileNo') {
      this.queueFrom.reset();
    } else {
      this.mobileFrom.reset();
    }
  }

  createForm(): void {
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    if (this.transaction.data.simCard.mobileNo && this.queueType === 'SMART_SHOP') {
      this.mobileFrom.patchValue({ mobileNo: this.transaction.data.simCard.mobileNo });
      this.mobileNo = this.transaction.data.simCard.mobileNo;
    }

    this.mobileFrom.valueChanges.subscribe((value) => {
      this.mobileNo = value.mobileNo;
    });

    this.queueFrom = this.fb.group({
      'queue': ['', Validators.compose([Validators.required, Validators.pattern(/([A-Y]{1}[0-9]{3})/)])],
    });

    this.queueFrom.valueChanges.subscribe((value) => {
      this.queue = value.queue;
    });
  }

  onNext(): void {
    this.transaction.data.queue = { queueNo: this.queue };
    this.createOrderService.createDeviceOrderDt(this.transaction, this.priceOption).then((response: any) => {
      if (response.data.resultCode === 'S') {
        this.transaction.data.payment.reserveNo = response.data.reserveNo;
        this.router.navigate([DEPOSIT_RESULT_PAGE]);
      } else {
        this.alertService.error('ระบบขัดข้อง');
      }
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  onBack(): void {
    this.router.navigate([DEPOSIT_PAYMENT_SUMMARY_PAGE]);
  }

  isLocationPhuket(): boolean {
    return this.user.locationCode === '1213' && this.tokenService.isAisUser();
  }

  onSendSMSQueue(mobileNo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.isLocationPhuket()) {
        return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
          mobileNo: mobileNo
        }).toPromise()
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            resolve(data.queueNo);
          }).catch((error) => {
            reject(null);
          });
      } else {
        return this.http.post('/api/salesportal/device-order/transaction/auto-gen-queue', {
          mobileNo: mobileNo
        }).toPromise()
          .then((response: any) => {
            if (response && response.data && response.data.data && response.data.data.queueNo) {
              resolve(response.data.data.queueNo);
            } else {
              reject(null);
            }
          }).catch((error) => {
            reject(null);
          });
      }
    });
  }

  checkValid(): boolean {
    if (this.queueType === 'AUTO_GEN_Q') {
      return this.mobileFrom.invalid && this.queueFrom.invalid;
    } else if (this.queueType === 'SMART_SHOP') {
      return this.mobileFrom.invalid;
    } else {
      return this.queueFrom.invalid;
    }
  }

  checkSkip(): boolean {
    return this.mobileFrom.value['mobileNo'] ? true : false;
  }

}
