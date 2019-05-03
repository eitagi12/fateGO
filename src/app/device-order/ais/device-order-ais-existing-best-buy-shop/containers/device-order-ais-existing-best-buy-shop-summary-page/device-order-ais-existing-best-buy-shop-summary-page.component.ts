import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction, Seller } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { ShoppingCart, HomeService, PageLoadingService, TokenService, AlertService, Utils } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_AVAILABLE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CHECK_OUT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-shop-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-shop-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-shop-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyShopSummaryPageComponent implements OnInit, OnDestroy {

  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  priceOption: PriceOption;
  shoppingCart: ShoppingCart;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  customerAddress: string;
  deposit: number;
  sellerCode: string;
  checkSellerForm: FormGroup;
  seller: Seller;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private modalService: BsModalService,
    private utils: Utils,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const user = this.tokenService.getUser();
    const customer = this.transaction.data.customer;
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

    this.deposit = this.transaction.data.preBooking
                    && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;

    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
      return this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise()
        .then((emResponse: any) => {
          if (emResponse && emResponse.data) {
            const emId = emResponse.data.pin;
            this.sellerCode = emId;
          }
        }).catch(() => {
          this.sellerCode = '';
        });
    }).then(() => this.createForm());
    this.createForm();
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    const changeMobileCareFlag = this.transaction.data.existingMobileCare && this.transaction.data.existingMobileCare.changeMobileCareFlag
    ? this.transaction.data.existingMobileCare.changeMobileCareFlag : true;
    if (changeMobileCareFlag) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_MOBILE_CARE_AVAILABLE_PAGE]);
    }
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.sellerCode}`).toPromise()
    .then((shopCheckSeller: any) => {
      if (shopCheckSeller.data.condition) {
        this.transaction.data.seller = {
          ...this.seller,
          sellerNo: this.sellerCode
        };
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_SHOP_CHECK_OUT_PAGE]);
        } else {
          this.alertService.error(shopCheckSeller.data.message);
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  createForm(): void {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });

    // console.log(this.seller);
    if (this.sellerCode) {
      this.checkSellerForm.patchValue({ checkSeller : this.sellerCode});
    }

    this.checkSellerForm.valueChanges.subscribe((value) => {
      if (value.checkSeller) {
        this.sellerCode = value.checkSeller;
      }
    });
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
