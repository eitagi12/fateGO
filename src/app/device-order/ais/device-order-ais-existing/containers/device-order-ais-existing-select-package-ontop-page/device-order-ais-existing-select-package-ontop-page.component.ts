import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService, ShoppingCart, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE
} from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
export interface IPackage {
  title: string;
  detail: string;
  priceExclVat: string;
  endDt: string;
}

@Component({
  selector: 'app-device-order-ais-existing-select-package-ontop-page',
  templateUrl: './device-order-ais-existing-select-package-ontop-page.component.html',
  styleUrls: ['./device-order-ais-existing-select-package-ontop-page.component.scss']
})
export class DeviceOrderAisExistingSelectPackageOntopPageComponent implements OnInit, OnDestroy {
  @ViewChild('template')
  template: TemplateRef<any>;
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;
  modalRef: BsModalRef;
  detail: string;

  transaction: Transaction;
  customerInfo: CustomerInfo;
  shoppingCart: ShoppingCart;
  packageOntopList: IPackage[];
  packageOntopForm: FormGroup;

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
    const idCardNo = this.transaction.data.customer.idCardNo;
    // const mobileNo = this.transaction.data.simCard.mobileNo;
    const mobileNo = '0910011560';
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    delete this.shoppingCart.mobileNo;
    this.callService(mobileNo);
  }
  callService(mobileNo: string): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/mobile-detail/${mobileNo}`).toPromise()
      .then((resp: any) => this.mappingPackageOnTop(resp))
      .catch(err => this.handleError(err));
  }

  mappingPackageOnTop(resp: any): void {
    const data = resp.data.packageOntop || {};
    const packageOntop = data.filter((packageOntopList: any) => {
      // tslint:disable-next-line:typedef
      return /On-Top/.test(packageOntopList.productClass)
        && packageOntopList.priceType === 'Recurring'
        && packageOntopList.priceExclVat > 0;
    });
    this.packageOntopList = packageOntop;
    console.log('packageOntopList', this.packageOntopList);
    this.pageLoadingService.closeLoading();
  }

  handleError(err: any): void {
    this.pageLoadingService.closeLoading();
    const error = err.error || {};
    const developerMessage = (error.errors || {}).developerMessage;
    this.alertService.error((developerMessage && error.resultDescription)
      ? `${developerMessage} ${error.resultDescription}` : `ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้`);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_EFFECTIVE_START_DATE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([this.checkRouteByExistingMobileCare()]);
  }

  checkRouteByExistingMobileCare(): string {
    if (this.transaction.data.existingMobileCare) {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_AVAILABLE_PAGE;
    } else {
      return ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_CARE_PAGE;
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenModal(detail: string): void {
    this.detail = detail || '';
    this.modalRef = this.modalService.show(this.template, { class: 'pt-5 mt-5' });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
