import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PageLoadingService, AlertService, TokenService, Utils } from 'mychannel-shared-libs';
import { Seller, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE,
  ROUTE_DEVICE_SELLING_QUEUE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
@Component({
  selector: 'app-deposit-payment-summary-page',
  templateUrl: './deposit-payment-summary-page.component.html',
  styleUrls: ['./deposit-payment-summary-page.component.scss']
})
export class DepositPaymentSummaryPageComponent implements OnInit {

  // public backUrl: string;
  public channelType: string;
  // sellerCode: string;
  // seller: Seller;
  // transaction: Transaction;
  wizards: any = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  priceOption: PriceOption;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  detail: string;

  customerAddress: string;
  deposit: number;
  sellerCode: string;
  checkSellerForm: FormGroup;
  seller: Seller;

  constructor(
    private router: Router,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    // const user = this.tokenService.getUser();
    // const customer = this.transaction.data.customer;
    // this.customerAddress = this.utils.getCurrentAddress({
    //   homeNo: customer.homeNo,
    //   moo: customer.moo,
    //   room: customer.room,
    //   floor: customer.floor,
    //   buildingName: customer.buildingName,
    //   soi: customer.soi,
    //   street: customer.street,
    //   tumbol: customer.tumbol,
    //   amphur: customer.amphur,
    //   province: customer.province,
    //   zipCode: customer.zipCode
    // });

    // this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
    //   this.seller = {
    //     sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
    //     locationName: response.data.displayName,
    //     locationCode: user.locationCode
    //   };
    // });
    // this.createForm();

  }
  createForm(): void {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });

    this.checkSellerForm.valueChanges.subscribe((value) => {
      if (value.checkSeller) {
        this.sellerCode = value.checkSeller;
      }
    });
  }
  onCancel(): void {
    const backUrl = '';
    this.router.navigate([backUrl]);
  }

  isUserASPType(): boolean {
    return this.tokenService.getUser().userType === 'ASP';
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_MOBILE_CARE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.sellerCode}`).toPromise()
    .then((shopCheckSeller: any) => {
      if (shopCheckSeller.data.condition) {
        this.transaction.data.seller = {
          ...this.seller,
          employeeId: shopCheckSeller.data.isAscCode
        };
        this.pageLoadingService.closeLoading();
        this.router.navigate([ROUTE_DEVICE_SELLING_QUEUE]);
        } else {
          this.alertService.error(shopCheckSeller.data.message);
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }
}
