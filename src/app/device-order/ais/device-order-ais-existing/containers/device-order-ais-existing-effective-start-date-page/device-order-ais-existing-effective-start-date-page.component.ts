import { Component, OnInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, ShoppingCart } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE
} from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { BillingAccount, Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-device-order-ais-existing-effective-start-date-page',
  templateUrl: './device-order-ais-existing-effective-start-date-page.component.html',
  styleUrls: ['./device-order-ais-existing-effective-start-date-page.component.scss']
})
export class DeviceOrderAisExistingEffectiveStartDatePageComponent implements OnInit, OnChanges, OnDestroy {

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

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.mobileNoSelect = this.shoppingCart.mobileNo;
  }

  ngOnInit(): void {
    this.createForm();
    this.getBillingAccountProcess();
    this.getMobileCare(this.mobileNoSelect);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.existingMobileCare) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
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
    } );
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

  getMobileCare(mobileNo: string): void {
    let handsetList: any;
    let packageList: any;
    let filerOnlyMobileCareList = [];
    let filterOnlyHandsetMobileCareList = [];
    this.http.get(`/api/customerportal/personalinfo-mobile-care-handset/${mobileNo}`).toPromise()
      .then((servicesList: any) => {
        if (servicesList && servicesList.data) {
          packageList = servicesList.data.mobileCareList;
          handsetList = servicesList.data.handsetList;
          if (packageList && packageList.length > 0) {
            filerOnlyMobileCareList = packageList
              .filter(aisPackage => {
                if (aisPackage.produuctGroup) {
                  return /mobilecare/.test(aisPackage.produuctGroup.toLowerCase().replace(/\s+/gi, ''));
                } else {
                  return false;
                }
              });
          }

          if (handsetList && handsetList.length > 0) {
            filterOnlyHandsetMobileCareList = handsetList
              .filter(handset => handset.productPkg ? /mobilecare/.test(handset.productPkg.toLowerCase().replace(/\s+/gi, '')) : false)
              .map(data => this.mappingHandSet(data));
          }
        }

        if (filerOnlyMobileCareList.length > 0 && filterOnlyHandsetMobileCareList.length > 0) {
          const handSetFillter: Handset = filterOnlyHandsetMobileCareList.find(obj => obj);
          const existingMobileCareFillter = filerOnlyMobileCareList.find(obj => obj);
          this.transaction.data.existingMobileCare = Object.assign(existingMobileCareFillter, { handSet: handSetFillter});
        }
      });

  }

  mappingHandSet(handsetData: any): Handset {
    if (!handsetData && !handsetData.attributeList) {
      return;
    }
    const brand = handsetData.attributeList.filter((handSet: any) => handSet.fName === 'Brand').map(data => data.fValue)[0];
    const model = handsetData.attributeList.filter((handSet: any) => handSet.fName === 'Model').map(data => data.fValue)[0];
    const color = handsetData.attributeList.filter((handSet: any) => handSet.fName === 'Color').map(data => data.fValue)[0];
    const imei = handsetData.attributeList.filter((handSet: any) => handSet.fName === 'IMEI').map(data => data.fValue)[0];
    const handset: Handset = {
      brand: brand,
      model: model,
      color: color,
      imei: imei
    };

    return handset;
  }
}
