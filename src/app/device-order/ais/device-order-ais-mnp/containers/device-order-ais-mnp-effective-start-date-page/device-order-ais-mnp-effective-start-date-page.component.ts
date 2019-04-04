import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { EligibleMobile, ShoppingCart, HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MobileCareService } from 'src/app/device-order/services/mobile-care.service';
import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

export interface Handset {
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

export interface BillCycleText {
  textBill: string;
  textDate: string;
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
export class DeviceOrderAisMnpEffectiveStartDatePageComponent implements OnInit, OnChanges {

  shoppingCart: ShoppingCart;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  mobileNoSelect: string;

  priceOption: PriceOption;
  transaction: Transaction;

  isLoad: boolean = true;

  billCycleText: BillCycleText[] = [{
    textBill: 'รอบบิลถัดไป',
    textDate: 'พร้อมใช้งานวันที่',
    value: 'NEXT_BILL'
  },
  {
    textBill: 'วัดถัดไป',
    textDate: 'พร้อมใช้งานวันที่',
    value: 'NEXT_DAY'
  },
  {
    textBill: 'มีผลทันที',
    textDate: 'พร้อมใช้งานได้ทันที',
    value: 'NOW'
  }];

  selected: BillCycleText;
  billingCycleForm: FormGroup;

  billingAccount: BillingAccount;
  billingAccountList: BillingAccount[];

  billCycleNextBill$: Observable<string>;
  billCycleNextDay$: Observable<string>;

  billcycleNo: string;

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

  constructor(
    private router: Router,
    private homeService: HomeService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private shoppingCartService: ShoppingCartService,
    private mobileCareService: MobileCareService,
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

  createForm(): void {
    this.billingCycleForm = this.fb.group({
      bill: [null, Validators.required]
    });

    this.billingCycleForm.valueChanges.subscribe(observer => {
      this.selected = observer.bill;
      console.log('value', this.selected);
    });

  }

  // tslint:disable-next-line:typedef
  async getBillingAccountProcess() {
    const idCardNo = this.transaction.data.customer.idCardNo;
    const mobileNo = this.mobileNoSelect;
    // this.mobileNo = mobileNo;

    await this.getBillingAccountList(idCardNo);
    console.log('sldldldldlll');

    // filter หา billing account ของ mobile number ที่ระบุ
    this.billingAccountList.find((ba: any) => {
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

  // tslint:disable-next-line:typedef
  async getBillingAccountList(idCardNo: string) {
    const self: any = this;
    await this.queryBillingAccountList(idCardNo).then(resp => {
      if (resp && resp.data && resp.data.billingAccountList) {
        self.billingAccountList = [];
        resp.data.billingAccountList.forEach((ba: any) => {
          self.billingAccountList.push(Object.assign(new BillingAccount(), ba));
        });
      } else {
        return;
      }
    });
  }

  queryBillingAccountList(idCardNo: string): Promise<any> {
    return this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`).toPromise();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.billingCycleForm) {
      this.billingCycleForm.patchValue({
        bill: this.selected
      });
    }
  }

  checked(value: string): boolean {
    return JSON.stringify(value) === JSON.stringify(this.selected);
  }

  getMobileCare(mobileNo: string): void {
    let hasMobileCare: boolean = false;
    let handsetList: any;
    let packageList: any;
    let filerOnlyMobileCareList = [];
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
        }
      });

    let filterOnlyHandsetMobileCareList = [];
    if (handsetList && handsetList.length > 0) {
      filterOnlyHandsetMobileCareList = handsetList
        .filter(handset => handset.productPkg ? /mobilecare/.test(handset.productPkg.toLowerCase().replace(/\s+/gi, '')) : false)
        .map(data => this.mappingHandSet(data));
    }

    if (filerOnlyMobileCareList.length > 0 && filterOnlyHandsetMobileCareList.length > 0) {
      // this.globalDeviceOrderService.setExistMobileCarePackage(filerOnlyMobileCareList);
      // this.globalDeviceOrderService.setExistHandSet(filterOnlyHandsetMobileCareList);
      hasMobileCare = true;
    } else {
      hasMobileCare = false;
    }
    if (hasMobileCare) {
      console.log('has Mobile Care');
      // set ว่ามี mobileCare หรือไม่
      // this.globalDeviceOrderService.setIsMobileCare(true)
    } else {
      console.log('no Mobile Care');
      // this.globalDeviceOrderService.setIsMobileCare(false)
    }
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
