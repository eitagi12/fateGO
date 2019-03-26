import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { HomeService, ApiRequestService, AlertService, PageLoadingService, SelectPaymentDetail, PaymentDetailOption, PaymentDetailQRCode } from '../../../../../../../node_modules/mychannel-shared-libs';
import { Transaction, TransactionType, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateOrderService } from '../../services/create-order.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Product } from 'src/app/device-only/ais/device-only-ais/models/product.model';

@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  private priceOption: PriceOption;
  isSuccess: boolean;
  public product: Product;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private apiRequestService: ApiRequestService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private createOrderService: CreateOrderService,
    private alertService: AlertService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.apiRequestService.createRequestId();
    if (!this.transaction.data) {
      this.transaction = {
        data: {
          action: TransactionAction.KEY_IN,
          transactionType: TransactionType.DEVICE_ORDER_DEVICE_ONLY
        },
        transactionId: this.createOrderService.generateTransactionId(this.apiRequestService.getCurrentRequestId())
      };
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.transactionService.remove();
    this.product = this.priceOption.queryParams;
    const brand: string = encodeURIComponent(this.product.brand ? this.product.brand : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    const model: string = encodeURIComponent(this.product.model ? this.product.model : '').replace(/\(/g, '%28').replace(/\)/g, '%29');
    // replace '%28 %29' for() case url refresh error
    const url: string = `/sales-portal/buy-product/brand/${brand}/${model}`;
    const queryParams: any = {
      modelColor: this.product.color,
      productType: this.product.productType,
      productSubType: this.product.productSubtype
    };
    this.router.navigate([url], { queryParams });
  }

  onNext(): void {
    this.createTransaction();
  }

  onComplete(customerInfo: Customer): void {
    console.log('customerInfo', customerInfo);
  }

  onError(error: boolean): void {
    this.isSuccess = error;
    console.log(this.isSuccess);
  }

  checkAction(action: string): void {
    if (action === 'READ_CARD') {
      this.transaction.data.action = TransactionAction.READ_CARD;
    } else {
      this.transaction.data.action = TransactionAction.KEY_IN;
    }
  }

  private createTransaction(): void {
    this.createOrderService.createTransaction(this.transaction, this.priceOption).then((res) => {
      if (res) {
        this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_MOBILE_CARE_PAGE]);
      } else {
        this.alertService.error('ระบบไม่สามารถทำรายการได้');
      }
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }
}
