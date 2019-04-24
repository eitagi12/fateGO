import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, REGEX_MOBILE, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_RESULT_PAGE } from '../../constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';

@Component({
  selector: 'app-device-order-ais-mnp-queue-page',
  templateUrl: './device-order-ais-mnp-queue-page.component.html',
  styleUrls: ['./device-order-ais-mnp-queue-page.component.scss']
})
export class DeviceOrderAisMnpQueuePageComponent implements OnInit, OnDestroy {

  transaction: Transaction;
  priceOption: PriceOption;
  queueFrom: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.queueFrom = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });

    // set default mobileNo to Input
    this.queueFrom.setValue({
      'mobileNo': this.transaction.data.simCard.mobileNo || ''
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE]);
  }

  getRequestDeviceSellOrder(): any {
    const user = this.tokenService.getUser();
    const productStock = this.priceOption.productStock;
    const trade = this.priceOption.trade;
    const data = this.transaction.data;

    const discount = trade.discount;
    const customer = data.customer;
    const simCard = data.simCard;
    const order = data.order;
    const queue = data.queue;
    return {
      userId: user.username,
      locationSource: user.locationCode,
      locationReceipt: user.locationCode,
      soCompany: productStock.company,
      productType: productStock.productType,
      productSubType: productStock.productSubtype,
      brand: productStock.brand,
      model: productStock.model,
      color: productStock.color,
      matCode: '',
      priceIncAmt: (+trade.normalPrice || 0).toFixed(2),
      tradeNo: trade.tradeNo || '',
      ussdCode: trade.ussdCode || '',
      priceDiscountAmt: (+discount.amount || 0).toFixed(2),
      // grandTotalAmt: this.getGrandTotalAmt(normalPrice, advancePay, discount, depositAmt, useDeposit),
      soId: order.soId,
      // saleCode: seller && seller.sellerNo || '',
      queueNo: queue.queueNo || '',
      cusNameOrder: `${customer.titleName || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
      taxCardId: customer.idCardNo || '',
      customerAddress: {
        addrNo: customer.homeNo,
        amphur: customer.amphur,
        buildingName: customer.buildingName,
        country: 'ประเทศไทย',
        floor: customer.floor,
        moo: customer.moo,
        mooban: customer.mooBan,
        postCode: customer.zipCode,
        province: customer.province.replace(/มหานคร$/, ''),
        room: customer.room,
        soi: customer.soi,
        streetName: customer.street,
        tumbon: customer.tumbol
      },
      cusMobileNoOrder: simCard.mobileNo || '',
      // returnCode: simCard.privilegeCode || '4GEYYY',
      // cashBackFlg: cashBackFlg,
      // matAirTime: advancePay && advancePay.matAirtime || '',
      // matCodeFreeGoods: matCodeFreeGoods,
      // paymentRemark: remark ? this.remarkService.getOrderRemark(remark, this.airTimeBank) : '',
      // installmentTerm: installmentMounth,
      // installmentRate: installmentPercentage,
      // mobileAisFlg: 'Y',
      // paymentMethod: paymentMethod,
      // bankCode: bankCode,
      // tradeFreeGoodsId: freeGoodsId || '',
      // matairtimeId: '',
      // tradeDiscountId: discountId || '',
      // tradeAirtimeId: airtimeId || '',
      // focCode: '',
      // bankAbbr: bankCode,
      // preBookingNo: preBookingNo,
      // depositAmt: depositAmt,
      // convertToNetwotkType: customerGroup.code === 'MC002' ? '3G POSTPAID' : undefined
    };
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.post('/api/salesportal/device-sell/order', {}).toPromise()
      .then(() => {
        return this.http.post('/api/salesportal/device-order/transaction/get-queue-qmatic', {
          mobileNo: this.queueFrom.value.mobileNo
        }).toPromise()
          .then((respQueue: any) => {
            const data = respQueue.data && respQueue.data.result ? respQueue.data.result : {};
            return data.queueNo;
          });
      })
      .then((queueNo: string) => {
        this.transaction.data.queue = {
          queueNo: queueNo
        };
        // update transaction
        this.sharedTransactionService.updateSharedTransaction(this.transaction, this.priceOption).then((resp) => {
          console.log('updateSharedTransaction', resp);
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_RESULT_PAGE]);
        });
      })
      .then(() => this.pageLoadingService.closeLoading());

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
