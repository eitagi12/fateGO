import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_KEY_IN_QUEUE } from '../../constants/route-path.constant';
import { HomeService, AlertService, PageLoadingService, REGEX_MOBILE } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HomeButtonService } from '../../services/home-button.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormGroup, FormBuilder, Validators, ValidationErrors, FormControl } from '@angular/forms';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-device-only-ais-qr-code-queue-page',
  templateUrl: './device-only-ais-qr-code-queue-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-queue-page.component.scss']
})
export class DeviceOnlyAisQrCodeQueuePageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup = new FormGroup({
    mobileNo: new FormControl()
  });
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private homeButtonService: HomeButtonService,
    private pageLoadingService: PageLoadingService,
    private sharedTransactionService: SharedTransactionService,
    private createOrderService: CreateOrderService,
    private queueService: QueueService
    ) {
      this.transaction = this.transactionService.load();
      this.priceOption = this.priceOptionService.load();
     }

  ngOnInit(): void {
    this.homeButtonService.initEventButtonHome();
  }
  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.queueService.autoGetQueue(this.queueFrom.value.mobileNo)
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        this.transactionService.update(this.transaction);
        this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then((response) => {
          if (response.data.isSuccess === true) {
            this.createOrderService.createOrderDeviceOnly(this.transaction, this.priceOption).subscribe(
              (res) => {
              if (res === 'S') {
                this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QUEUE_PAGE]);
              } else if (res === 'F') {
                this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_KEY_IN_QUEUE]);
              }
            },
            (err) => {
              this.pageLoadingService.closeLoading();
              this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_KEY_IN_QUEUE]);
            }
           );
          }
        });
      }).catch((err) => {
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_KEY_IN_QUEUE]);
      });
  }

}
