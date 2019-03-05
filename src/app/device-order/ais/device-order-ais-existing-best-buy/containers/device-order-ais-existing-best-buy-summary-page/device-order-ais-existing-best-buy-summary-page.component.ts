import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, TokenService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ProductDetail } from 'mychannel-shared-libs/lib/service/models/product-detail';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuySummaryPageComponent implements OnInit, OnDestroy {

  @Input() isPrebooking: boolean;
  @Input() depositAmt: number;

  wizards = WIZARD_DEVICE_ORDER_AIS;
  identityValid = true;
  transaction: Transaction;
  productDetail: ProductDetail;
  paymentResult: number;
  customer: Customer;
  fullAddress: string;
  promotionPricePB: number;


  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }


  ngOnInit() {
    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
        seller: {
          sellerName: 'MC',
          locationName: 'สาขาอาคารเอไอเอส',
          locationCode: 'string',
          sellerNo: 'string',
          shareUser: 'string'
        },
        customer: {
          idCardNo: 'string',
          idCardType: 'string',
          titleName: 'หลวง',
          firstName: 'จัสติน',
          lastName: 'วัดดูยูมีน',
          birthdate: 'string',
          gender: 'string',
          homeNo: 'string',
          moo: '75',
          mooBan: 'หมู่ที่ 5',
          buildingName: 'กิ่งไผ่',
          floor: '3',
          room: '345',
          street: 'พหลโยธิน',
          soi: 'พหลโยธิน 23',
          tumbol: 'ตากแดด',
          amphur: 'ตากฝน',
          province: 'ตากกล้วย',
          firstNameEn: 'string',
          lastNameEn: 'string',
          issueDate: 'string',
          expireDate: 'string',
          zipCode: '86100',
          mainMobile: 'string',
          mainPhone: 'string',
          billCycle: 'string',
          caNumber: 'string',
          imageSignature: 'string', // Contract signature
          imageSignatureSmartCard: 'string',
          imageSmartCard: 'string',
          imageReadSmartCard: 'string',
          customerPinCode: 'string',
          privilegeCode: 'string',
        },
        mainPromotion: {
          cammapign: {
            campaignName: 'AIS BEST BUY'
          },
          trade: {
            promotionPrice: 200,
            advancePay: {
              amount: 300,
              description: 'Handset'
            }
          }
        },
        existingMobileCare: {
          promotionName: 'promotion mobile care',
          productClass: 'string',
          produuctGroup: 'string',
          productPkg: 'string',
          productCd: 'string'
      },
      }
    };



    this.productDetail = {
      dv: [],
      model: 'IPHONE8P256',
      name: 'APPLE iPhone 8 Plus 256GB',
      productSubtype: 'HANDSET',
      productType: 'DEVICE',
      products: [
        {
          colorName: 'SPACE GREY',
          colorCode: '999184',
          sku: 'undifined'
        }
      ],
      statusCode: '20000',
    };


    this.customer = this.transaction.data.customer;
    this.fullAddress = this.getFullAddress(this.customer);
    this.paymentResult = this.getPromotionPrice() + this.getPackagePrice();

    if (this.isPrebooking) {
      this.paymentResult = this.paymentResult - this.depositAmt;
      this.promotionPricePB = this.getPromotionPrice() - this.depositAmt;
    }


  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE]);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  // calculatePaymentResult(transaction) {
  //   const promotionPrice = transaction.data.mainPromotion.trade.promotionPrice;
  //   const packagePrice =  transaction.data.mainPromotion.trade.advancePay.amount;
  //   return promotionPrice + packagePrice;
  // }

  getPromotionPrice(): number {
    const promotionPrice: number  = this.transaction.data.mainPromotion.trade.promotionPrice;
    return promotionPrice;
  }

  getPackagePrice(): number {
    const packagePrice: number  = this.transaction.data.mainPromotion.trade.advancePay.amount;
    return packagePrice;
  }




  getFullAddress(customer: Customer) {
    if (customer) {
      const fullAddress =
        (customer.homeNo ? customer.homeNo + ' ' : '') +
        (customer.moo ? 'หมู่ที่ ' + customer.moo + ' ' : '') +
        (customer.mooBan ? 'หมู่บ้าน ' + customer.mooBan + ' ' : '') +
        (customer.room ? 'ห้อง ' + customer.room + ' ' : '') +
        (customer.floor ? 'ชั้น ' + customer.floor + ' ' : '') +
        (customer.buildingName ? 'อาคาร ' + customer.buildingName + ' ' : '') +
        (customer.soi ? 'ซอย ' + customer.soi + ' ' : '') +
        (customer.street ? 'ถนน ' + customer.street + ' ' : '') +
        (customer.tumbol ? 'ตำบล/แขวง ' + customer.tumbol + ' ' : '') +
        (customer.amphur ? 'อำเภอ/เขต ' + customer.amphur + ' ' : '') +
        (customer.province ? 'จังหวัด ' + customer.province + ' ' : '') +
        (customer.zipCode || '');
      return fullAddress || '-';
    } else {
      return '-';
    }
  }






}
