import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { EligibleMobile, ShoppingCart, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { Observable, of, Subscription } from 'rxjs';
import * as moment from 'moment';
import { ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_PACKAGE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { TranslateService } from '@ngx-translate/core';

export interface BillCycleText {
  textBill?: string;
  textDate?: string;
  value: string;
}

export class BillingAccount {
  billingName: string;
  mobileNo: string[];
  billCycleFrom: string;
  billCycleTo: string;
  payDate: string;
  billingAddr: string;
  billAcctNo: string;
  bill: string;
}

@Component({
  selector: 'app-device-order-ais-mnp-effective-start-date-page',
  templateUrl: './device-order-ais-mnp-effective-start-date-page.component.html',
  styleUrls: ['./device-order-ais-mnp-effective-start-date-page.component.scss']
})
export class DeviceOrderAisMnpEffectiveStartDatePageComponent implements OnInit, OnChanges, OnDestroy {

  shoppingCart: ShoppingCart;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  mobileNoSelect: string;

  priceOption: PriceOption;
  transaction: Transaction;

  currentLang: string = 'TH';
  translationSubscribe: Subscription;

  billCycleText: BillCycleText[] = [];

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

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private fb: FormBuilder,
    private translationService: TranslateService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.mobileNoSelect = this.shoppingCart.mobileNo;

    this.currentLang = this.translationService.currentLang || 'TH';
    this.setBillingCycleTranslate();
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      this.setBillingCycleTranslate();
    });

  }

  setBillingCycleTranslate(): void {
    this.billCycleText = [{
      textBill: this.currentLang === 'TH' ? 'รอบบิลถัดไป' : 'Next Bill',
      textDate: this.currentLang === 'TH' ? 'พร้อมใช้งานวันที่' : 'Ready to use date',
      value: 'B'
    }, {
      textBill: this.currentLang === 'TH' ? 'วันถัดไป' : 'Next Day',
      textDate: this.currentLang === 'TH' ? 'พร้อมใช้งานวันที่' : 'Ready to use date',
      value: 'D'
    }, {
      textBill: this.currentLang === 'TH' ? 'มีผลทันที' : 'Immediate effect',
      textDate: this.currentLang === 'TH' ? 'พร้อมใช้งานได้ทันที' : 'Ready to use immediately',
      value: 'I'
    }];
  }

  ngOnInit(): void {
    this.createForm();
    this.getBillingAccountProcess();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.existingMobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE]);
    }
  }
  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.billingCycleForm = this.fb.group({
      bill: [null, Validators.required]
    });
    this.billingCycleForm.valueChanges.subscribe(observer => {
      this.selectedBillCycle = observer.bill;
      this.transaction.data.billingInformation.overRuleStartDate = observer.bill.value;
    });

    // check set default
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
        this.billcycleNo = ba.bill;
        // let day; let mouth; let year;
        const nextD = new Date();
        nextD.setDate(nextD.getDate() + 1);
        nextD.setMonth(nextD.getMonth());
        const nextBill = new Date();
        for (let i: number = 0; i < this.billCycleMap.length; i++) {
          if (this.billCycleMap[i].billNo === this.billcycleNo) {
            if (nextBill.getDate() <= +this.billCycleMap[i].from) {
              nextBill.setDate(this.billCycleMap[i].from);
              nextBill.setMonth(nextBill.getMonth());
            } else {
              nextBill.setDate(this.billCycleMap[i].from);
              nextBill.setMonth(nextBill.getMonth() + 1);
            }
            this.billCycleNextBill$ = of(this.convertDateToStarngDDMMMYYYY(nextBill));
            this.billCycleNextDay$ = of(this.convertDateToStarngDDMMMYYYY(nextD));
          }
        }
        return true;
      } else {
        return false;
      }
    });
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
}
