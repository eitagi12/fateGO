import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ApiRequestService, PageLoadingService, HomeService, TokenService, User, AlertService, Utils } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE, ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE } from 'src/app/device-order/ais/device-order-ais-existing-best-buy/constants/route-path.constant';
import { Transaction, TransactionType, TransactionAction, Customer, Prebooking, Seller } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ProductDetail } from 'mychannel-shared-libs/lib/service/models/product-detail';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { a, b } from '@angular/core/src/render3';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-summary-page',
  templateUrl: './device-order-ais-existing-best-buy-summary-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-summary-page.component.scss']
})
export class DeviceOrderAisExistingBestBuySummaryPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  identityValid = false;
  transaction: Transaction;
  pricreOption: PriceOption;

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
    private utils: Utils

  ) {
    this.transaction = this.transactionService.load();
    this.pricreOption = this.priceOptionService.load();
  }


  ngOnInit() {
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
                    && this.transaction.data.preBooking.depositAmt ? Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;

    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode
      };
    });
    this.createForm();

  }

  onHome() {
    this.homeService.goToHome();
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_MOBILE_CARE_PAGE]);
  }

  onNext() {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.sellerCode}`).toPromise()
    .then((shopCheckSeller: any) => {
      if (shopCheckSeller.data.condition) {
        this.transaction.data.seller = {
          ...this.seller,
          employeeId: shopCheckSeller.data.isAscCode
        };
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_BEST_BUY_CHECK_OUT_PAGE]);
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

  createForm() {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.required, Validators.pattern(/^[0-9]+$/)]
    });

    this.checkSellerForm.valueChanges.subscribe((value) => {
      if (value.checkSeller) {
        this.identityValid = true;
        this.sellerCode = value.checkSeller;
      }
    });
  }

  onOpenDetail(detail: string) {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

  summary(amount: number[]) {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }


}
