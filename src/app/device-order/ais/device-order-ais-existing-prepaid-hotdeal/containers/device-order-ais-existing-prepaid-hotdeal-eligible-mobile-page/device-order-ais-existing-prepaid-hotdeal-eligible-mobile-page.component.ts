import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart, EligibleMobile, REGEX_MOBILE, PageLoadingService, ChargeType } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE,
  ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { resolve } from 'dns';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';

export interface BillingAccount {
  billingName: string;
  mobileNo: string[];
  billCycleFrom: string;
  billCycleTo: string;
  payDate: string;
  billingAddr: string;
  billAcctNo: string;
  bill: string;
  productPkg: string;
  billMedia: string;
}
@Component({
  selector: 'app-device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page',
  templateUrl: './device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.html',
  styleUrls: ['./device-order-ais-existing-prepaid-hotdeal-eligible-mobile-page.component.scss']
})
export class DeviceOrderAisExistingPrepaidHotdealEligibleMobilePageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  shoppingCart: ShoppingCart;
  eligibleMobiles: Array<EligibleMobile>;
  selectMobileNo: EligibleMobile;
  addMobileNo: string;
  transaction: Transaction;
  billingAccountList: Array<BillingAccount>;
  billingNetExtremeList: Array<BillingAccount>;
  eligibleAddMobile: FormGroup;
  priceOption: PriceOption;

  idCardNo: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
  ) {
    this.transaction = this.transactionService.load();
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
    this.priceOption = this.priceOptionService.load();
    this.createForm();
  }

  ngOnInit(): void {
    if (this.transaction.data.customer) {
      this.idCardNo = this.transaction.data.customer.idCardNo;
      this.getMobileList();
    } else {
      this.onBack();
    }
  }

  createForm(): void {
    this.eligibleAddMobile = this.fb.group({
      mobileAdd: ['', [Validators.pattern(REGEX_MOBILE)]]
    });

    this.eligibleAddMobile.valueChanges.subscribe((value) => {
      if (this.eligibleAddMobile.valid ) {
        this.addMobileNo = value.mobileAdd;
      } else {
        this.addMobileNo = '';
      }
    });
  }

  getMobileList(): void {
    this.http.get(`/api/customerportal/newRegister/${this.idCardNo}/queryPrepaidMobileList`).toPromise()
      .then((resp: any) => {
        const prepaidMobileList = resp.data.prepaidMobileList || [];
        this.mapPrepaidMobileNo(prepaidMobileList);
      })
      .catch(() => {
      });
  }

  mapPrepaidMobileNo(mobileList: any): void {
    const mobiles: Array<EligibleMobile> = new Array<EligibleMobile>();
    mobileList.forEach(element => {
      mobiles.push({ mobileNo: element.mobileNo, mobileStatus: element.status });
    });
    this.eligibleMobiles = mobiles;
    console.log('this.eligibleMobiles', this.eligibleMobiles);
    console.log('checkPrivilage', this.checkPrivilage(this.eligibleMobiles));
  }

  verifyMobileNo(mobileNo: string): Promise<any> {

    const verifyMobile: any = {
      mobileNo: mobileNo,
      isRePrepaidIdent: false
    };
    // tslint:disable-next-line:no-shadowed-variable
    return new Promise((resolve, reject) => {
      this.http.get(`/api/customerportal/asset/${mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        if (!resp) {
          return reject('ไม่สามารถทำรายการได้ เนื่องจากหมายเลขนี้ยังไม่เปิดใช้บริการในระบบเติมเงิน');
        }
        const data = resp.data;
        const status = data.mobileStatus;
        if (data.chargeType !== 'Pre-paid') {
          return reject('ไม่สามารถทำรายการได้ เนื่องจากเป็นหมายเลขระบบรายเดือน');
        }
        if (status === '000' || status === '378' || status === 'Active' || status === 'Suspended') {
          return data;
        } else {
          return reject('ไม่สามารถทำรายการได้ เนื่องจากหมายเลขนี้ยังไม่เปิดใช้บริการในระบบเติมเงิน');
        }
      })
      .then((req: any) => {
        return this.http.get(`/api/customerportal/newRegister/verifyPrepaidIdent?idCard=${this.idCardNo}&mobileNo=${mobileNo}`).toPromise()
        .then((respPrepaid: any) => {
          verifyMobile.isRePrepaidIdent = !!(respPrepaid.data.success);
          return respPrepaid;
        });
      })
      .then((respPrivilege: any) => {

      })
      .catch((err) => {
        return reject(err);
      });
    });
  }

  checkPrivilage(mobiles: any[]): Promise<any[]> {
    if (!mobiles) {
        return Promise.resolve([]);
    }
    const promise = [];
    const ussdCode = this.priceOption.trade.ussdCode;
    mobiles.forEach(mobile => {
        // tslint:disable-next-line:no-shadowed-variable
        const service = new Promise((resolve, reject) => {
          this.http.post(`/api/salesportal/privilege/check-privilege`, {
            msisdn: mobile.mobileNo,
            shortCode: ussdCode
          }).toPromise()
          .then((resp: any) => {
            if (resp.data.status === '20000') {
                resolve(mobile);
            } else {
                resolve(null);
            }
          }).catch((error: any) => {
            // console.log('Check privilage ', error);
            const data = this.handleResponseError(error);
              if (data.description === 'DUPLICATE' || data.description === 'SEND_MSG_AGAIN') {
                this.http.post(`/api/salesportal/privilege/check-device-transaction`, {
                  msisdn: mobile.mobileNo,
                  shortCode: ussdCode,
                  numDay: 15
                }).toPromise()
                .then((deviceResp: any) => {
                  if (deviceResp.data.status === '20000') {
                      // ตรวจสอบสิทธิ์การใช้ privilege
                      return {
                          mobileNo: mobile.mobileNo,
                          privilegeCode: ussdCode,
                          status: mobile.status
                      };
                  } else {
                      return null;
                  }
              }).catch((error: any) => {
                  console.log('Check device transaction ', error);
                  return null;
              });
                // this.checkDeviceTransaction(mobile, ussdCode)
                // .then(resolve).catch(() => resolve(null));
              } else {
                resolve(null);
              }
            });
        });
        promise.push(service);
    });

    return Promise.all(promise).then((values: any[]) => values.filter(value => value));
}

handleResponseError(error: any): any {
  try {
      const body = JSON.parse(error._body);
      const _error = body.errors;
      const data = _error.substring(_error.indexOf('{'), _error.indexOf('}') + 1);
      return JSON.parse(data);
  } catch (e) {
      return error;
  }
}

  onComplete(eligibleMobile: EligibleMobile): void {
    this.selectMobileNo = eligibleMobile;
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.addMobileNo) {
      this.verifyMobileNo(this.addMobileNo).then((res: any) => {
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.pageLoadingService.closeLoading();
      });
    } else {
      this.http.get(`/api/customerportal/asset/${this.selectMobileNo.mobileNo}/profile`).toPromise()
      .then((resp: any) => {
        if (resp && resp.data) {
          const data = resp.data;
          this.transaction.data.simCard = {
            mobileNo: this.selectMobileNo.mobileNo,
            persoSim: false,
            chargeType: data.chargeType || ChargeType.PRE_PAID,
            simSerial: data.simSerialNo,
            billingSystem: data.billingSystem,
            nType: data.product
          };
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_CUSTOMER_INFO_PAGE]);
        } else {
          this.pageLoadingService.closeLoading();
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
      });
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_PREPAID_HOTDEAL_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

}
