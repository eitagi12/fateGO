import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, AlertService, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueuePageService } from 'src/app/device-order/services/queue-page.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  mobileFrom: FormGroup;
  queueFrom: FormGroup;
  queue: string;
  user: User;
  mobileNo: string;
  isAutoGenQueue: boolean;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private priceOptionService: PriceOptionService,
    private pageLoadingService: PageLoadingService,
    private tokenService: TokenService,
    private sharedTransactionService: SharedTransactionService,
    private queuePageService: QueuePageService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.isAutoGenQueue = this.user.locationCode === '1100' || this.user.locationCode === '1213' ;
    this.createForm();
  }

  createForm(): void {
    this.mobileFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(/^0[6-9]{1}[0-9]{8}/)])],
    });

    if (this.transaction.data.simCard.mobileNo) {
      this.mobileFrom.patchValue({mobileNo: this.transaction.data.simCard.mobileNo});
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
      this.isAutoGenQueue = false;
    });
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.isAutoGenQueue) {
      this.onSendSMSQueue(this.mobileNo).then((queue) => {
        if (queue) {
          this.transaction.data.queue = { queueNo: queue };
          return this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption).then(() => {
            return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
                    this.pageLoadingService.closeLoading();
                    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE]);
                  });
          });
        } else {
          this.isAutoGenQueue = false;
          this.pageLoadingService.closeLoading();
          this.alertService.error('ขออภัยค่ะ ระบบไม่สามารถ กดรับบัตรคิวอัตโนมัติได้ \n กรุณาระบุหมายเลขคิว');
          return;
        }
      }).catch(() => {
        this.isAutoGenQueue = false;
        this.pageLoadingService.closeLoading();
        this.alertService.error('ขออภัยค่ะ ระบบไม่สามารถ กดรับบัตรคิวอัตโนมัติได้ \n กรุณาระบุหมายเลขคิว');
        return;
      });
    } else {
      this.transaction.data.queue = { queueNo: this.queue };
      this.queuePageService.createDeviceSellingOrder(this.transaction, this.priceOption).then(() => {
        return this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then(() => {
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_RESULT_PAGE]);
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
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
          });
      }
    });
  }

  checkValid(): boolean {
    if (!this.isAutoGenQueue) {
      return !!this.queueFrom.invalid;
    } else {
      return !!this.mobileFrom.invalid;
    }
  }

}
