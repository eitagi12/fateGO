import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TokenService, User, HomeService, AlertService, Utils, PageLoadingService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS_EXISTING_GADGET } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE } from '../../constants/route-path.constant';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-validate-customer-page',
  templateUrl: './device-order-ais-existing-gadget-validate-customer-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-validate-customer-page.component.scss']
})
export class DeviceOrderAisExistingGadgetValidateCustomerPageComponent implements OnInit {

  wizards: any = WIZARD_DEVICE_ORDER_AIS_EXISTING_GADGET;
  readonly PLACEHOLDER: string = '(หมายเลขโทรศัพท์ / เลขบัตรประชาชน)';
  readonly PLACEHOLDER_HEADDER: string = 'กรอกเอกสารแสดงตน';

  transaction: Transaction;
  priceOption: PriceOption;
  user: User;
  identityValid: boolean = false;
  identity: string;
  isFbbNo: boolean;

  constructor(
    private router: Router,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private tokenService: TokenService,
    private homeService: HomeService,
    private alertService: AlertService,
    private http: HttpClient,
    private utils: Utils,
    private pageLoadingService: PageLoadingService,
    private customerInfoService: CustomerInfoService

  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
    this.homeService.callback = () => {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              window.location.href = '/';
            });
          }
        });
    };
  }

  ngOnInit(): void {
    this.createTransaction();
  }

  private createTransaction(): void {
  }

  onReadCard(): void {
    this.transaction.data.action = TransactionAction.READ_CARD;
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_ID_CARD_PAGE]);
  }

  onCompleted(identity: string): void {
    this.identity = identity;
  }

  onError(valid: boolean): void {
    this.identityValid = valid;
  }

  onNext(): void {

    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CUSTOMER_INFO_PAGE]);

    // this.pageLoadingService.openLoading();

    // console.log(this.isFbbNo);

    // const body: any = {
    //   inOption: '3',
    //   inMobileNo: '8850014976'
    // }
    // this.customerInfoService.queryFbbInfo(body);

  }

  customerValidate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const length: number = control.value.length;
    const REGEX_FBB_MOBILE = /^88[0-9]\d{7}$/;
    this.isFbbNo = REGEX_FBB_MOBILE.test(value);

    if (length >= 10) {
      if (length === 10) {
        if (this.utils.isMobileNo(value) || this.isFbbNo) {
          return null;
        } else {
          return {
            message: 'กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง',
          };
        }
      } else if (length === 13) {
        if (this.utils.isThaiIdCard(value)) {
          return null;
        } else {
          return {
            message: 'กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง',
          };
        }
      } else {
        return {
          message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
        };
      }
    } else {
      return {
        message: 'กรุณากรอกรูปแบบให้ถูกต้อง',
      };
    }
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();

      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const queryParams = this.priceOption.queryParams;
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
        .then((response: any) => {
          if (response.value === true) {
            this.returnStock().then(() => {
              this.transactionService.remove();
              // window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
            });
          }
        });
    } else {
      this.transactionService.remove();
      // window.location.href = `/sales-portal/buy-product/brand/${queryParams.brand}/${queryParams.model}`;
    }
  }
}
