import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, PageLoadingService, REGEX_MOBILE, HomeService, ShoppingCart } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

import {
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ,
  WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART
} from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_REASON_PAGE,
  ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
@Component({
  selector: 'app-new-register-mnp-network-type-page',
  templateUrl: './new-register-mnp-network-type-page.component.html',
  styleUrls: ['./new-register-mnp-network-type-page.component.scss']
})
export class NewRegisterMnpNetworkTypePageComponent implements OnInit, OnDestroy {
 wizards: string[];
 wizardJaymart: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_JAYMART;
 wizardTelewiz: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN_TELEWIZ;

  transaction: Transaction;
  priceOption: PriceOption;
  mnpForm: FormGroup;
  shoppingCart: ShoppingCart;
  action: number = 4;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private removeCartService: RemoveCartService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.checkJaymart();
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhumTelewiz();
    this.createForm();
  }

  checkJaymart(): void {
    const outChnSale = this.priceOption.queryParams.isRole;
    if (outChnSale && (outChnSale === 'Retail Chain' || outChnSale === 'RetailChain')) {
      this.wizards = this.wizardJaymart;
      this.action = 4;
    } else {
      this.wizards = this.wizardTelewiz;
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const mobileNoMember = this.mnpForm.value.mobileNoMember;
    const subscriberId: string = mobileNoMember;
    const orderType: string = 'Port - In';
    const isProduction: any = environment.name !== 'PROD' && environment.name !== 'SIT' ? true : false;
    const isStartDt: any = isProduction === true ? 30 : 3;
    const startDt: string = encodeURIComponent(moment().subtract(isStartDt, 'days').format('YYYYMMDD HH:mm:ss'));
    const endDt: string = encodeURIComponent(moment().format('YYYYMMDD HH:mm:ss'));
    this.http.get(`/api/customerportal/newRegister/history-order`, {
      params: {
        subscriberId: subscriberId,
        orderType: orderType,
        startDt: startDt,
        endDt: endDt
      }
    })
      .toPromise()
      .then((resp: any) => {
        const historyOrder = (resp.data || []).find((order: any) => {
          return order.statusCode === 'Submit for Approve'
            || order.statusCode === 'Pending'
            || order.statusCode === 'Submitted'
            || order.statusCode === 'Await'
            || order.statusCode === 'Accept'
            || order.statusCode === 'Approve';
        });
        if (historyOrder) {
          this.pageLoadingService.closeLoading();
          const createDate = moment(historyOrder.createDate, 'YYYYMMDD').format('DD/MM/YYYY');
          this.alertService.error(`ระบบไม่สามารถทำรายการได้ <br>หมายเลข ${mobileNoMember}
          อยู่ระหว่างรอการอนุมัติย้ายค่ายมาใช้บริการกับ AIS ระบบรายเดือน/เติมเงิน
          (ทำรายการวันที่ ${createDate})`);
        } else {
          this.checkCustomerProfile();
        }
      }).catch(() => this.checkCustomerProfile());
  }

  createForm(): void {
    this.mnpForm = this.fb.group({
      'mobileNoMember': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'pinCode': ['', Validators.compose([Validators.required, Validators.pattern(/\d{8}/)])]
    });
  }

  checkCustomerProfile(): void {
    const mobileNoMember = this.mnpForm.value.mobileNoMember;
    this.http.post(`/api/customerportal/newRegister/getCCCustInfo/${mobileNoMember}`, {
    }).toPromise()
      .then((resp: any) => {
        this.pageLoadingService.closeLoading();
        const outbuf = resp.data
          && resp.data.data
          && resp.data.data.A_GetCCCustInfoResponse
          && resp.data.data.A_GetCCCustInfoResponse.outbuf
          ? resp.data.data.A_GetCCCustInfoResponse.outbuf : {};

        const mobileNoStatus = (outbuf.mobileNoStatus || '').trim();
        const networkType = (outbuf.networkType || '').trim();
        const accountNo = (outbuf.accountNo || '').trim();

        if (!outbuf || (accountNo && (mobileNoStatus === 'Disconnect - Ported' || mobileNoStatus === 'U' || mobileNoStatus === 'T' ||
          mobileNoStatus === '')) || mobileNoStatus !== 'Active' && !(mobileNoStatus || networkType) || mobileNoStatus === '') {
          this.transaction.data.simCard = {
            ...this.transaction.data.simCard,
            memberSimCard: [{
              mobileNo: mobileNoMember,
              simSerial: '',
              persoSim: false,
              chargeType: 'Post-paid',
              pinCode: this.mnpForm.value.pinCode
            }]
          };
          this.transaction.data.customer = {
            ...this.transaction.data.customer ,
            customerPinCode: this.mnpForm.value.pinCode,
          };
          this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_REASON_PAGE]);
        } else {
          return this.alertService.error(`หมายเลข ${mobileNoMember} เป็นเบอร์ AIS`);
        }
      }).catch(() => {
        this.pageLoadingService.closeLoading();
        this.transaction.data.simCard = {
          ...this.transaction.data.simCard,
          memberSimCard: [{
            mobileNo: mobileNoMember,
            simSerial: '',
            persoSim: false,
            chargeType: 'Post-paid',
            pinCode: this.mnpForm.value.pinCode
          }]
        };
        this.transaction.data.customer = {
          ...this.transaction.data.customer ,
          customerPinCode: this.mnpForm.value.pinCode,
        };
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
