import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Utils, PageLoadingService } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { CustomerInformationService } from '../../services/customer-information.service';
@Component({
  selector: 'app-summary-payment-detail',
  templateUrl: './summary-payment-detail.component.html',
  styleUrls: ['./summary-payment-detail.component.scss']
})
export class SummaryPaymentDetailComponent implements OnInit {
  private mobileNo: string;
  private balance: number;
  public enoughBalance: boolean;
  private mobileCare: number;
  private buyMobileCare: boolean = false;
  priceOption: PriceOption;
  transaction: Transaction;
  customerAddress: string;
  price: string;
  @Output() conditionNext: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private utils: Utils,
    private http: HttpClient,
    private customerInformationService: CustomerInformationService,
    private pageLoadingService: PageLoadingService,
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
    this.getDataCustomer();
    this.checkExMobileCare();
  }

  private checkExMobileCare(): void {
    if (this.transaction.data.mobileCarePackage.customAttributes) {
      this.buyMobileCare = true;
      if (this.transaction.data.simCard.chargeType === 'Pre-paid') {
        this.getQueryBalance(this.transaction.data.simCard.mobileNo);
      } else {
        this.conditionNext.emit(true);
      }
    } else {
      this.conditionNext.emit(true);
    }
  }

  public checkOpenningPrepaidMobileCare(): boolean {
    return (this.buyMobileCare && (this.transaction.data.simCard.chargeType === 'Pre-paid')) ? true : false;
  }

  getDataCustomer(): void {
    const customer = this.transaction.data.customer;
    if (customer) {
      this.customerAddress = this.utils.getCurrentAddress({
        homeNo: customer.homeNo,
        moo: customer.moo,
        room: customer.room,
        floor: customer.floor,
        buildingName: customer.buildingName,
        soi: customer.soi,
        street: customer.street,
        tumbol: customer.tumbol,
        amphur: customer.amphur,
        province: customer.province,
        zipCode: customer.zipCode
      });
    } else {
      this.customerAddress = '';
    }
  }

  private getQueryBalance(mobileNo: string): void {
    this.http.get(`/api/customerportal/newRegister/${mobileNo}/queryBalance`).toPromise()
      .then((response: any) => {
        this.mobileCare = +this.transaction.data.mobileCarePackage.customAttributes.priceInclVat;
        this.balance = +(response.data.remainingBalance) / 100;
        this.enoughBalance = (this.balance >= this.mobileCare) ? true : false;
        this.pageLoadingService.closeLoading();
        if (!this.enoughBalance) {
          this.conditionNext.emit(false);
        } else {
          this.conditionNext.emit(true);
        }
      })
      .catch((err) => {
        this.pageLoadingService.closeLoading();
        console.log(err);
      });
  }

  onLoadBalance(): void {
    this.pageLoadingService.openLoading();
    const mobileNoRefesh: string = this.transaction.data.simCard.mobileNo;
    this.getQueryBalance(mobileNoRefesh);
  }

}
