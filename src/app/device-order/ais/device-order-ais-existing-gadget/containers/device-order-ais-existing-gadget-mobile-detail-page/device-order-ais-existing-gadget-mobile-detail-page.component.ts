import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, TransactionAction, BillingAccount } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ProfileFbb } from 'src/app/shared/models/profile-fbb.model';

import { MobileInfo, ShoppingCart, HomeService, PageLoadingService, BillingSystemType, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { PromotionShelveService } from 'src/app/device-order/services/promotion-shelve.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { CustomerInfoService } from 'src/app/device-order/services/customer-info.service';
import {
  ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_IDENTIFY_PAGE
} from 'src/app/device-order/ais/device-order-ais-existing-gadget/constants/route-path.constant';
import { ProfileFbbService } from 'src/app/shared/services/profile-fbb.service';

@Component({
  selector: 'app-device-order-ais-existing-gadget-mobile-detail-page',
  templateUrl: './device-order-ais-existing-gadget-mobile-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-mobile-detail-page.component.scss']
})
export class DeviceOrderAisExistingGadgetMobileDetailPageComponent implements OnInit {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;
  transaction: Transaction;
  priceOption: PriceOption;
  mobileInfo: MobileInfo;
  profileFbb: ProfileFbb;
  shoppingCart: ShoppingCart;
  mobileNo: string;
  disableNextButton: boolean;
  action: string;
  isNext: boolean;
  alertWording: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private profileFbbService: ProfileFbbService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private promotionShelveService: PromotionShelveService,
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.profileFbb = this.profileFbbService.load();
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.mobileNo = this.transaction.data.simCard.mobileNo;
    this.action = this.transaction.data.action;
    this.callServiceMobileDetail();
  }

  callServiceMobileDetail(): void {
    this.http.get(`/api/customerportal/mobile-detail/${this.mobileNo}`).toPromise()
      .then((mobileDetail: any) => {
        this.mappingMobileDetailAndPromotion(mobileDetail);
        this.mappingMobileDetail(mobileDetail);
      })
      .catch(this.ErrorMessage());
  }

  mappingMobileDetailAndPromotion(mobileDetail: any): void {
    this.callQueryContractFirstPackAndGetPromotionShelveServices()
      .then(promotionsShelves => this.filterPromotionshelveAndMobileDetail(mobileDetail, promotionsShelves))
      .then((response: boolean) => {
        this.pageLoadingService.closeLoading();
        this.isNext = response;
        if (this.alertWording) {
          this.alertService.warning(this.alertWording);
        }
      })
      .catch(this.ErrorMessage());
  }

  callQueryContractFirstPackAndGetPromotionShelveServices(): Promise<any> {
    const trade: any = this.priceOption.trade;
    const privilege: any = this.priceOption.privilege;
    const billingSystem = 'All';
    return this.http.post(`/api/salesportal/query/contract-first-pack`, {
      option: '1',
      mobileNo: this.mobileNo,
      profileType: 'All'
    }).toPromise()
      .then((resp: any) => {
        const contract = resp.data || {};
        if (contract) {
          this.transaction.data.contractFirstPack = contract;
        }
        return this.callGetPromotionShelveService(trade, billingSystem, privilege, contract);
      });
  }

  callGetPromotionShelveService(trade: any, billingSystem: string, privilege: any, contract: any): any[] | PromiseLike<any[]> {
    return this.promotionShelveService.getPromotionShelve({
      packageKeyRef: trade.packageKeyRef,
      orderType: `Change Service`,
      billingSystem: billingSystem
    }, +privilege.minimumPackagePrice, +privilege.maximumPackagePrice)
      .then((promotionShelves: any) => this.filterPromotions(promotionShelves, contract));
  }

  filterPromotions(promotionShelves: any = [], contract: any = {}): any[] {
    (promotionShelves || [])
      .forEach((promotionShelve: any) => {
        promotionShelve.promotions = (promotionShelve.promotions || [])
          .filter((promotion: any) => {
            promotion.items = this.filterItemsByFirstPackageAndInGroup(promotion, contract);
            return promotion.items.length > 0;
          });
      });
    return promotionShelves;

  }

  filterItemsByFirstPackageAndInGroup(promotion: any, contract: any): any {
    return (promotion.items || [])
      .filter((item: {
        value: {
          customAttributes: {
            priceExclVat: number;
            productPkg: any;
          };
        };
      }) => {
        const contractFirstPack = item.value.customAttributes.priceExclVat
          >= Math.max(contract.firstPackage || 0, contract.minPrice || 0, contract.initialPackage || 0);
        const inGroup = contract.inPackage.length > 0 ? contract.inPackage
          .some((inPack: any) => inPack === item.value.customAttributes.productPkg) : true;
        return contractFirstPack && inGroup;
      });
  }

  filterPromotionshelveAndMobileDetail(mobileDetail: any, promotionsShelves: any): boolean {
    // tslint:disable-next-line: max-line-length
    const { promotionCodeFuturePackage, promotionCodeCurrentPackage, promotionCode }: { promotionCodeFuturePackage: string; promotionCodeCurrentPackage: string; promotionCode: string[]; } = this.setPromotionCode(mobileDetail, promotionsShelves);
    let isNext: boolean = false;
    let havePackages: any;
    console.log('promotionCode of promotionsShelves', promotionCode);
    if (this.havePackages(promotionsShelves)) {
      if (promotionCodeFuturePackage) {
        havePackages = promotionCode.filter((code: string) => {
          return code === promotionCodeFuturePackage;
        });
        isNext = havePackages[0] ? true : false;
        this.alertWording = isNext ? '' : 'แพ็กเกจหลักไม่ร่วมโครงการ \n กรุณาเปลี่ยนแพ็กเกจ';
        console.log(isNext ? '' : '(มีFuturePackage) แต่ไม่มี FuturePackage ที่เหมือนกับ package');
      } else {
        havePackages = promotionCode.filter((code: string) => {
          return code === promotionCodeCurrentPackage;
        });
        isNext = havePackages[0] ? true : false;
        this.alertWording = isNext ? '' : 'แพ็กเกจหลักไม่ร่วมโครงการ \n กรุณาเปลี่ยนแพ็กเกจ';
        console.log(isNext ? '' : '(ไม่มีFuturePackage) และไม่มี CurrentPackage ที่เหมือนกับ package');
      }
    } else {
      this.disableNextButton = true;
      this.alertWording = `เบอร์ ${this.mobileNo} ไม่สามารถรับสิทธิ์โครงการนี้ได้
      \n กรุณาเปลี่ยนเบอร์ใหม่ เพื่อรับสิทธิ์ซื้อเครื่องราคาพิเศษ`;
    }
    return isNext;
  }

  private setPromotionCode(mobileDetail: any, promotionsShelves: any): any {
    // tslint:disable-next-line: max-line-length
    const promotionCodeFuturePackage: string = mobileDetail.data.futurePackage.promotionCode ? mobileDetail.data.futurePackage.promotionCode : '';
    const promotionCodeCurrentPackage: string = mobileDetail.data.package.promotionCode ? mobileDetail.data.package.promotionCode : '';
    const promotionCode: Array<string> = [];
    promotionsShelves.map((promotionsshelves) => {
      promotionsshelves.promotions.map((promotion) => {
        promotion.items.map((items) => {
          promotionCode.push(items.value.feedItemId);
        });
      });
    });
    return { promotionCodeFuturePackage, promotionCodeCurrentPackage, promotionCode };
  }

  mappingMobileDetail(mobileDetail: any): any {
    const serviceYear = mobileDetail.data.serviceYear;
    this.mobileInfo = this.mappingMobileInfo(mobileDetail, serviceYear);
    this.transaction.data.simCard.chargeType = mobileDetail.chargeType;
    this.transaction.data.simCard.billingSystem = mobileDetail.billingSystem;
    this.transaction.data.currentPackage = mobileDetail.package;
  }

  mappingMobileInfo(mobileDetail: any, serviceYear: any): MobileInfo {
    return {
      mobileNo: this.mobileNo || mobileDetail.data.mobileNo,
      chargeType: mobileDetail.data.chargeType === 'Post-paid' ? 'รายเดือน' : 'เติมเงิน',
      status: mobileDetail.data.mobileStatus,
      sagment: mobileDetail.data.mobileSegment,
      serviceYear: this.serviceYearWording(serviceYear),
      mainPackage: mobileDetail.data.packageTitle
    };
  }

  serviceYearWording(serviceYear: any): string {
    let serviceYearWording = '';
    if (serviceYear.year) {
      serviceYearWording = `${serviceYear.year || ''} ปี `;
    }
    if (serviceYear.month) {
      serviceYearWording += `${serviceYear.month} เดือน `;
    }
    if (serviceYear.day) {
      serviceYearWording += `${serviceYear.day} วัน`;
    }
    return serviceYearWording;
  }

  havePackages(promotionsShelves: any): boolean {
    return (promotionsShelves || []).length > 0
      && promotionsShelves.some(promotionsShelve => promotionsShelve.promotions.length > 0);

  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    if (this.action === TransactionAction.KEY_IN_FBB) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_CUSTOMER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_ELIGIBLE_MOBILE_PAGE]);
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.action === TransactionAction.KEY_IN_FBB) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_VALIDATE_IDENTIFY_PAGE]);
    } else {
      const idCardNo = this.transaction.data.customer.idCardNo;
      this.http.get(`/api/customerportal/newRegister/${idCardNo}/queryBillingAccount`).toPromise()
        .then(response => this.mappingMobileBillAccountAndIsAirtimeAndCheckWarning(response, this.mobileNo))
        .then(() => this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_PAYMENT_DETAIL_PAGE]))
        .catch(this.ErrorMessage());
    }

  }

  mappingMobileBillAccountAndIsAirtimeAndCheckWarning(response: any, mobileNo: string): void {
    this.pageLoadingService.closeLoading();
    const { mobileBillAccount, isAirtime }: {
      mobileBillAccount: string[];
      isAirtime: boolean;
    } = this.mappingMobileBillAccountAndIsAirtime(response, mobileNo);

    this.transaction.data.billingInformation.isNewBAFlag = !!(mobileBillAccount.length > 1);
    this.checkWarningBillingAccountMessage(mobileBillAccount, isAirtime);
  }

  mappingMobileBillAccountAndIsAirtime(resp: any, mobileNo: string): {
    mobileBillAccount: string[];
    isAirtime: boolean;
  } {
    const data = resp.data || {};
    const billingAccountList: any = [];
    const mobileNoList: any = [];

    data.billingAccountList.forEach((list: any) => billingAccountList.push(list));
    billingAccountList.forEach((billings: { mobileNo: any; }) => mobileNoList.push(billings.mobileNo));

    let isAirtime: boolean = false;
    if (this.priceOption.trade) {
      const trade = this.priceOption.trade;
      isAirtime = !!(trade.advancePay.amount > 0);
    }

    const billCycles = this.transaction.data.billingInformation.billCycles;
    const mobileBillAccount = this.mapBillingCyclesByMobileNo(billCycles, mobileNo);
    return { mobileBillAccount, isAirtime };
  }

  mapBillingCyclesByMobileNo(billCycles: BillingAccount[], mobileNo: string): string[] {
    return billCycles.map(billcycle => billcycle.mobileNo).find((mobile) => mobile.includes(mobileNo));
  }

  checkWarningBillingAccountMessage(mobileBillAccount: string[], isAirtime: boolean): void {
    if (mobileBillAccount && mobileBillAccount.length > 1 && isAirtime) {
      this.alertService.warning('หมายเลขนี้มีการรวมบิล ไม่สามารถทำรายการได้')
        .then(() => this.onBack());
    }
  }

  ErrorMessage(): (reason: any) => void | PromiseLike<void> {
    return (err: any) => {
      this.handleErrorMessage(err);
    };
  }

  handleErrorMessage(err: any): void {
    this.disableNextButton = true;
    this.pageLoadingService.closeLoading();
    const error = err.error || {};
    const developerMessage = (error.errors || {}).developerMessage;
    this.alertService.error((developerMessage && error.resultDescription)
      ? `${developerMessage} ${error.resultDescription}` : `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`);
  }

}
