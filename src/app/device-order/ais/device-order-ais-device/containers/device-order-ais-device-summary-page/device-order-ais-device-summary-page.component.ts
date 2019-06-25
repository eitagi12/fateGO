import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TelNoBillingInfo, TokenService, PageLoadingService, AlertService, ShoppingCart, Utils } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE, ROUTE_DEVICE_AIS_DEVICE_AGGREGATE_PAGE } from 'src/app/device-order/ais/device-order-ais-device/constants/route-path.constant';
import { SummaryPageService } from 'src/app/device-order/services/summary-page.service';

@Component({
  selector: 'app-device-order-ais-device-summary-page',
  templateUrl: './device-order-ais-device-summary-page.component.html',
  styleUrls: ['./device-order-ais-device-summary-page.component.scss']
})
export class DeviceOrderAisDeviceSummaryPageComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  priceOption: PriceOption;
  transaction: Transaction;
  shoppingCart: ShoppingCart;
  customerAddress: string;
  telNoBillingInfo: TelNoBillingInfo;
  seller: Seller;
  sellerCode: string;
  employeeDetailForm: FormGroup;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private translation: TranslateService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private tokenService: TokenService,
    private priceOptionService: PriceOptionService,
    private shoppingCartService: ShoppingCartService,
    private utils: Utils,
    public summaryPageService: SummaryPageService,

  ) {
    this.priceOption = this.priceOptionService.load();
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    const customer = this.transaction.data.customer;

    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
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
    this.getSeller();
  }

  getSeller(): void {
    this.pageLoadingService.openLoading();
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
      if (this.seller) {
        if (this.ascCodeToken) {
          this.employeeDetailForm.patchValue({ascCode: this.ascCodeToken});
        }
      }
      return this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise()
        .then((emResponse: any) => {
          if (emResponse && emResponse.data) {
            const emId = emResponse.data.pin;
            this.sellerCode = emId;
          }
        }).catch(() => {
          this.sellerCode = '';
        });
    }).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }

  createEmployeeForm(): void {
    this.employeeDetailForm = this.fb.group({
      ascCode: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });
  }

  get ascCodeToken(): string {
    return this.seller ? this.seller.locationCode : '';
  }

  get sellerName(): string {
    return this.seller ? this.seller.sellerName : '';
  }

  get offsetName(): string {
    return this.seller ? this.seller.locationName : '';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_PAYMENT_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_AGGREGATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onOpenDetail(detail: string): void {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
}
