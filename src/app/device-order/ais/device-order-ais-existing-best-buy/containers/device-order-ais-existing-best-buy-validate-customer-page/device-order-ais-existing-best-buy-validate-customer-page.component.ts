import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, Utils } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE } from 'src/app/buy-product/constants/route-path.constant';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, BillDeliveryAddress, Customer} from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-validate-customer-page',
  templateUrl: './device-order-ais-existing-best-buy-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyValidateCustomerPageComponent implements OnInit, OnDestroy {

  readonly PLACEHOLDER = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  identityValid = false;
  identity: string;
  band: string;
  model: string;
  priceOption: PriceOption;
  billDeliveryAddress: BillDeliveryAddress;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private apiRequestService: ApiRequestService,
    private http: HttpClient,
    private utils: Utils
  ) {
    // this.homeService.callback = () => {
    //   window.location.href = `/sales-portal/buy-product/brand/${this.band}/${this.model}`;
    // };
   }

  ngOnInit() {
    this.createTransaction();
  }

  onError(valid: boolean) {
    this.identityValid = valid;
  }

  onCompleted(identity: string) {
    this.identity = identity;
  }

  onReadCard() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    // this.homeService.goToHome();
    // this.homeService.callback = () => {
    //   window.location.href = `/sales-portal/buy-product/brand/${this.band}/${this.model}`;
    // };
    this.router.navigate([ROUTE_BUY_PRODUCT_CAMPAIGN_PAGE], { queryParams: this.priceOption.queryParams });
  }

  onNext() {
    this.pageLoadingService.openLoading();
    if (this.utils.isMobileNo(this.identity)) {
      // KEY-IN MobileNo
      this.http.get(`/api/customerportal/mobile-detail/${this.identity}`)
      .toPromise()
      .then((mobileDetail) => {
        return;
      });
    }

    this.http.get(`/api/customerportal/newRegister/${this.identity}/queryCustomerInfo`)
      .toPromise()
      .then((resp: any) => {
        const data = resp.data || {};
        const fullName = (data.name || ' ').split(' ');
        const address = data.address || {};
        const customer: Customer = {
          idCardNo: this.identity || '',
          idCardType: data.idCardType || '',
          titleName: data.accntTitle || '',
          firstName: fullName[0] || '',
          lastName: fullName[1] || '',
          birthdate: data.birthdate || '',
          homeNo: address.houseNo || '',
          moo: address.moo || '',
          mooBan: address.mooban || '',
          buildingName: address.buildingName || '',
          floor: address.floor || '',
          room: address.room || '',
          street: address.streetName || '',
          soi: address.soi || '',
          tumbol: address.tumbol || '',
          amphur: address.amphur || '',
          province: address.provinceName || '',
          zipCode: address.zipCode || '',
          mainMobile: data.mainMobile || '',
          mainPhone: data.mainPhone || '',
          billCycle: data.billCycle || '',
          caNumber: data.accntNo || ''
        }
        return Promise.resolve(customer);
      })
      .then((customer) => {
        this.billDeliveryAddress = {
          homeNo: customer.homeNo || '',
          moo: customer.moo || '',
          mooBan: customer.mooBan || '',
          room: customer.room || '',
          floor: customer.floor || '',
          buildingName: customer.buildingName || '',
          soi: customer.soi || '',
          street: customer.street || '',
          province: customer.province || '',
          amphur: customer.amphur || '',
          tumbol: customer.tumbol || '',
          zipCode: customer.zipCode || '',
        };
        this.transaction.data.customer = customer;
        this.transaction.data.billingInformation = {};
        this.transaction.data.billingInformation.billDeliveryAddress = this.billDeliveryAddress;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CUSTOMER_INFO_PAGE]);
      })
      .catch((e) => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_ELIGIBLE_MOBILE_PAGE]);
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction() {
    // New x-api-request-id
    this.apiRequestService.createRequestId();

    this.transaction = {
      data: {
        transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
        action: TransactionAction.KEY_IN,
      }
    };
  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length = control.value.length;

    if (length === 10) {
      if (this.utils.isMobileNo(value)) {
        return null;
      } else {
        return {
          message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
        };
      }
    }

    if (length === 13) {
      // if (value.startsWith('0')) {
      //   if (this.utils.isImmIdCard(value)) {
      //     return null;
      //   } else {
      //     return {
      //       message: 'กรุณากรอกเลขบัตรประจำตัวคนต่างด้าวให้ถูกต้อง',
      //     };
      //   }
      // } else {
        if (this.utils.isThaiIdCard(value)) {
          return null;
        } else {
          return {
            message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
          };
        }
      // }
    }
  }

}
