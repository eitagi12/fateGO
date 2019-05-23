import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE } from 'src/app/device-order/ais/device-order-ais-mnp/constants/route-path.constant';
export interface IPackage {
  title: string;
  detail: string;
  priceExclVat: string;
  endDt: string;
}

@Component({
  selector: 'app-device-order-ais-mnp-select-package-ontop-page',
  templateUrl: './device-order-ais-mnp-select-package-ontop-page.component.html',
  styleUrls: ['./device-order-ais-mnp-select-package-ontop-page.component.scss']
})
export class DeviceOrderAisMnpSelectPackageOntopPageComponent implements OnInit, OnDestroy {
  @ViewChild('template')
  template: TemplateRef<any>;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  modalRef: BsModalRef;
  detail: string;
  effectiveDate: string;

  arrCheckBox: Array<Object> = [];
  isCheckbox: boolean;
  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;
  packageOntopList: IPackage[];
  packageOntopForm: FormGroup;

  testFrom: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private alertService: AlertService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // const idCardNo = this.transaction.data.customer.idCardNo;
    // const mobileNo = this.transaction.data.simCard.mobileNo;
    if (this.transaction.data.billingInformation.overRuleStartDate === 'B') {
      this.effectiveDate = this.transaction.data.billingInformation.effectiveDate;
    } else if (this.transaction.data.billingInformation.overRuleStartDate === 'D') {
      this.effectiveDate = moment().add(1, 'days').format('DD/MM/YYYY');
    } else {
      this.effectiveDate = 'หลังจากได้รับ SMS ยืนยัน';
    }
    const mobileNo = '0910011560';
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    this.callService(mobileNo);
    this.createForm();
  }
  onClick(value: any, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.arrCheckBox.push(value);
    } else {
      this.arrCheckBox.splice(this.arrCheckBox.length - 1, 1);
    }
    this.transaction.data.deleteOntopPackage = this.arrCheckBox;
    console.log('checkbox', this.transaction.data.deleteOntopPackage);
  }
  // checked(promotionCode: string): boolean {
  //   const deleteOntopPackage = this.transaction && this.transaction.data && this.transaction.data.deleteOntopPackage;
  //   return !!(deleteOntopPackage || []).find(ontop => ontop.promotionCode === promotionCode);
  // }

  createForm(): void {
    // const formControls = this.packageOntopList.map(control => new FormControl(false))
    // console.log(formControls)

    this.packageOntopForm = new FormGroup({
      package: new FormControl()
    });
    // this.packageOntopForm = this.fb.group({
    //   package: new FormControl(),
    // });
  }
  callService(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    this.http
      .get(`/api/customerportal/mobile-detail/${mobileNo}`)
      .toPromise()
      .then((resp: any) => this.mappingPackageOnTop(resp))
      .then(() => this.pageLoadingService.closeLoading());
  }

  mappingPackageOnTop(resp: any): void {
    const data = resp.data.packageOntop || {};

    const packageOntop = data.filter((packageOntopList: any) => {
      // tslint:disable-next-line:typedef
      const isexpiredDate = moment().isBefore(moment(packageOntopList.endDt, 'DD-MM-YYYY'));
      return (
        /On-Top/.test(packageOntopList.productClass) && packageOntopList.priceType === 'Recurring' &&
        packageOntopList.priceExclVat > 0 && isexpiredDate
      );
    }).sort((a: any, b: any) => a.priceExclVat - b.priceExclVat);
    this.packageOntopList = packageOntop;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_EFFECTIVE_START_DATE_PAGE]);
  }

  onNext(): void {
    console.log('this.arrCheckBox', this.arrCheckBox);
    this.router.navigate([this.checkRouteByExistingMobileCare()]);
  }

  checkRouteByExistingMobileCare(): string {
    if (this.transaction.data.existingMobileCare) {
      return ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_AVALIBLE_PAGE;
    } else {
      return ROUTE_DEVICE_ORDER_AIS_MNP_MOBILE_CARE_PAGE;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenModal(detail: string): void {
    this.detail = detail || '';
    this.modalRef = this.modalService.show(this.template, {
      class: 'pt-5 mt-5'
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
