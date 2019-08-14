import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ShoppingCart, HomeService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_ONTOP_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import * as moment from 'moment';

interface BillCycleText {
  textBill?: string;
  textDate?: string;
  value: string;
}

interface Handset {
  productGroup?: string;
  paymentMode?: string;
  productPkg?: string;
  priceType?: string;
  integrationName?: string;
  productCd?: string;
  promotionName?: string;
  startDt?: string;
  attributeList?: Array<any>;
  brand?: string;
  model?: string;
  color?: string;
  enrollType?: string;
  imei?: string;
  price?: string;
  receipt_dt?: string;
  replaceFee?: string;
  swapFee?: string;
}

@Component({
  selector: 'app-device-order-ais-existing-gadget-effective-start-date-page',
  templateUrl: './device-order-ais-existing-gadget-effective-start-date-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-effective-start-date-page.component.scss']
})

export class DeviceOrderAisExistingGadgetEffectiveStartDatePageComponent implements OnInit, OnChanges, OnDestroy {

  shoppingCart: ShoppingCart;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  mobileNoSelect: string;

  priceOption: PriceOption;
  transaction: Transaction;

  billCycleText: BillCycleText[] = [{
    textBill: 'รอบบิลถัดไป',
    textDate: 'พร้อมใช้งานวันที่',
    value: 'B'
  },
  {
    textBill: 'วันถัดไป',
    textDate: 'พร้อมใช้งานวันที่',
    value: 'D'
  },
  {
    textBill: 'มีผลทันที',
    textDate: 'พร้อมใช้งานได้ทันที',
    value: 'I'
  }];

  billCycleMap: any = [
    { billNo: '11', from: '4', to: '3' },
    { billNo: '12', from: '8', to: '7' },
    { billNo: '13', from: '12', to: '11' },
    { billNo: '14', from: '16', to: '15' },
    { billNo: '15', from: '20', to: '19' },
    { billNo: '16', from: '24', to: '23' },
    { billNo: '17', from: '28', to: '27' },
    { billNo: '18', from: '1', to: 'สิ้นเดือน' },
  ];

  selectedBillCycle: BillCycleText;
  billingCycleForm: FormGroup;
  billingAccountList: BillingAccount[];
  billCycleNextBill$: Observable<string>;
  billCycleNextDay$: Observable<string>;
  billcycleNo: string;
  packageOntopList: any[] = [];

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private translateService: TranslateService,
    private http: HttpClient,
    private fb: FormBuilder,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.mobileNoSelect = this.shoppingCart.mobileNo;
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
    this.createForm();
    this.getBillingAccountProcess();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    if (this.checkPackageOntop()) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SELECT_PACKAGE_ONTOP_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_GADGET_SUMMARY_PAGE]);
    }
  }

  checkPackageOntop(): boolean {
    const haveOntopPackage: boolean = this.transaction.data.onTopPackage ? true : false;
    return haveOntopPackage;
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  mainPackageTitle(value: any = {}): string {
    return this.translateService.currentLang === 'EN' ? value.shortNameEng : value.shortNameThai;
  }

  createForm(): void {
    this.billingCycleForm = this.fb.group({
      bill: [null, Validators.required]
    });
    this.billingCycleForm.valueChanges.subscribe(observer => {
      this.selectedBillCycle = observer.bill;
      this.transaction.data.billingInformation.overRuleStartDate = observer.bill.value;
    });

    this.setControlBillingCycleForm();
  }

  setControlBillingCycleForm(): void {
    if (this.checkOverRuleStartDate()) {
      const value = this.billCycleText.find(this.mathBillValueByTransaction());
      this.billingCycleForm.controls['bill'].setValue(value);
    } else {
      this.billingCycleForm.controls['bill'].setValue(this.billCycleText[0]);
    }
  }

  getBillingAccountProcess(): void {
    const mobileNo = this.mobileNoSelect;
    // filter หา billing account ของ mobile number ที่ระบุ
    const billingAccountList: any = this.transaction.data.billingInformation.billCycles;

    billingAccountList.find((ba: any) => {
      if (ba.mobileNo.includes(mobileNo)) {
        return this.mappingBillCycleNextBillAndBillCycleNextDay(ba);
      } else {
        return false;
      }
    });
  }

  mappingBillCycleNextBillAndBillCycleNextDay(ba: any): boolean {
    this.billcycleNo = ba.bill;
    // let day; let mouth; let year;
    const nextD = new Date();
    nextD.setDate(nextD.getDate() + 1);
    nextD.setMonth(nextD.getMonth());
    const nextBill = new Date();

    return this.setDateAndMonthNextBill(nextBill, nextD);
  }

  setDateAndMonthNextBill(nextBill: Date, nextD: Date): boolean {
    for (let i: number = 0; i < this.billCycleMap.length; i++) {
      if (this.billCycleMap[i].billNo === this.billcycleNo) {
        if (nextBill.getDate() <= +this.billCycleMap[i].from) {
          nextBill.setDate(this.billCycleMap[i].from);
          nextBill.setMonth(nextBill.getMonth());
        } else {
          nextBill.setDate(this.billCycleMap[i].from);
          nextBill.setMonth(nextBill.getMonth() + 1);
        }
        this.billCycleNextDay$ = of(this.convertDateToStarngDDMMMYYYY(nextD));
        const textNextBill = this.convertDateToStarngDDMMMYYYY(nextBill);
        this.billCycleNextBill$ = of(textNextBill);
        this.transaction.data.billingInformation.effectiveDate = textNextBill;
      }
    }
    return true;
  }

  convertDateToStarngDDMMMYYYY(date: Date): any {
    if (date) {
      return moment(date).format('DD/MM/YYYY');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.billingCycleForm) {
      this.billingCycleForm.patchValue({
        bill: this.selectedBillCycle
      });
    }
  }

  checked(value: string): boolean {
    if (this.transaction && this.transaction.data && this.transaction.data.billingInformation &&
      this.transaction.data.billingInformation.overRuleStartDate) {
      return JSON.stringify(value) === JSON.stringify(this.transaction.data.billingInformation.overRuleStartDate);
    } else {
      return false;
    }
  }

  checkFormValid(): boolean {
    if (this.transaction && this.transaction.data && this.transaction.data.billingInformation &&
      this.transaction.data.billingInformation.overRuleStartDate) {
      return true;
    } else {
      return this.billingCycleForm.valid;
    }
  }

  mathBillValueByTransaction(): (bill: BillCycleText) => boolean {
    return bill => bill.value === this.transaction.data.billingInformation.overRuleStartDate;
  }

  checkOverRuleStartDate(): boolean {
    return !!(this.transaction.data.billingInformation && this.transaction.data.billingInformation.overRuleStartDate);
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
}
