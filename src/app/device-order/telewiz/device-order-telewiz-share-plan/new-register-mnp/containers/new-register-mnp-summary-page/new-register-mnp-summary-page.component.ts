import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCart, HomeService, Utils, TokenService, PageLoadingService, AlertService } from 'mychannel-shared-libs';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { RemoveCartService } from '../../services/remove-cart.service';

@Component({
  selector: 'app-new-register-mnp-summary-page',
  templateUrl: './new-register-mnp-summary-page.component.html',
  styleUrls: ['./new-register-mnp-summary-page.component.scss']
})
export class NewRegisterMnpSummaryPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  customerAddress: string;
  translateSubscription: Subscription;

  seller$: Seller;
  employeeDetailForm: FormGroup;
  sellerCode: string;
  currentLang: string;

  templatePopupRef: BsModalRef;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private priceOptionService: PriceOptionService,
    private transactionService: TransactionService,
    private shoppingCartService: ShoppingCartService,
    private modalService: BsModalService,
    public summaryPageService: SummaryPageService,
    private utils: Utils,
    private translateService: TranslateService,
    private tokenService: TokenService,
    private http: HttpClient,
    private alertService: AlertService,
    private fb: FormBuilder,
    private removeCartService: RemoveCartService
  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();

    this.currentLang = this.translateService.currentLang || 'TH';
    this.translateSubscription = this.translateService.onLangChange.subscribe(lang => {
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
    });
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    const customer = this.transaction.data && this.transaction.data.billingInformation
      && this.transaction.data.billingInformation.billDeliveryAddress ?
      this.transaction.data.billingInformation.billDeliveryAddress : this.transaction.data.customer;
    this.shoppingCart = this.shoppingCartService.getShoppingCartDataSuperKhum();

    this.customerAddress = this.utils.getCurrentAddress({
      homeNo: customer.homeNo,
      moo: customer.moo,
      room: customer.room,
      floor: customer.floor,
      buildingName: customer.buildingName,
      soi: customer.soi,
      street: customer.street,
      tumbol: customer.tumbol,
      amphur: customer.amphur,
      province: customer.province,
      zipCode: customer.zipCode
    });
    this.createEmployeeForm();
    this.getSeller$();
  }

  createEmployeeForm(): void {
    this.employeeDetailForm = this.fb.group({
      ascCode: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    const user = this.tokenService.getUser();
    this.pageLoadingService.openLoading();
    const ascCode = this.employeeDetailForm.controls['ascCode'].value || '';
    if (!ascCode) {
      this.alertService.error('กรุณาระบุรหัสพนักงานขาย');
    } else {
      this.http.get(`/api/customerportal/checkSeller/${ascCode.trim()}`).toPromise().then((resp: any) => {
        const checkSeller: any = resp && resp.data ? resp.data : {};
        if (checkSeller.condition) {
          this.transaction.data.seller.sellerNo = this.sellerCode || '';
          this.transaction.data.seller.employeeId = ascCode;
          this.transaction.data.seller.sellerName = user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username;
          this.pageLoadingService.closeLoading();
          this.router.navigate([ROUTE_DEVICE_ORDER_TELEWIZ_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE]);
        } else {
          this.alertService.warning(checkSeller.message);
        }
      });
    }
  }

  onHome(): void {
    this.removeCartService.backToReturnStock('/', this.transaction);
  }

  onShowPackagePopup(templatePopup: TemplateRef<any>, detail: string): void {
    // tslint:disable-next-line: max-line-length
    this.detail = detail;
    this.templatePopupRef = this.modalService.show(templatePopup);
  }

  mainPackageTitle(detail: any): string {
    return (this.translateService.currentLang === 'EN') ? detail.shortNameEng : detail.shortNameThai;
  }

  memberMainPackageTitle(detail: any): string {
    return (this.translateService.currentLang === 'EN') ? '' : detail.title;
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }

  getSeller$(): any {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller$ = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
    }).then(() => {
      this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise().then((response: any) => {
        if (response && response.data) {
          this.sellerCode = response.data.pin;
          this.employeeDetailForm.patchValue({ ascCode: this.sellerCode });
        }
      }).then(() => {
        this.priceOption.productStock.locationName = this.seller$.locationName;
        this.transaction.data.seller = this.seller$;
        this.pageLoadingService.closeLoading();
      }).catch(() => {
        this.sellerCode = '';
        this.pageLoadingService.closeLoading();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
