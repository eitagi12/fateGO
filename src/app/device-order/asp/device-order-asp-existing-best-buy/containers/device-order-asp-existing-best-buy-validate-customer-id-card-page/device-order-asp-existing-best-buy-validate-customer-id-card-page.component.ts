import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { PageLoadingService, HomeService, ReadCardProfile, User, AlertService, ValidateCustomerIdCardComponent, TokenService, ReadCardService, ReadCard, ReadCardEvent } from 'mychannel-shared-libs';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { Transaction, Customer, BillDeliveryAddress, Prebooking } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE, ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE } from '../../constants/route-path.constant';
import { CustomerInfoService } from '../../services/customer-info.service';
import { HttpClient } from '@angular/common/http';
import { SharedTransactionService } from 'src/app/shared/services/shared-transaction.service';
import { WIZARD_DEVICE_ORDER_ASP, WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-order-asp-existing-best-buy-validate-customer-id-card-page',
  templateUrl: './device-order-asp-existing-best-buy-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-asp-existing-best-buy-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAspExistingBestBuyValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {

  kioskApi: boolean;
  isTelewiz: boolean = this.tokenService.isTelewizUser();
  // wizards: any = this.tokenService.isTelewizUser() ? WIZARD_DEVICE_ORDER_ASP : WIZARD_DEVICE_ORDER_AIS;
  // active: number = this.isTelewiz ? 2 : 1;

  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;
  priceOption: PriceOption;
  user: User;
  billDeliveryAddress: BillDeliveryAddress;

  readCard: ReadCard;
  readCardSubscription: Subscription;

  showProgress: boolean;

  @ViewChild(ValidateCustomerIdCardComponent)
  validateCustomerIdcard: ValidateCustomerIdCardComponent;

  progress: number;
  error: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private alertService: AlertService,
    private customerInfoService: CustomerInfoService,
    private priceOptionService: PriceOptionService,
    private sharedTransactionService: SharedTransactionService,
    private tokenService: TokenService,
    private readCardService: ReadCardService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    this.user = this.tokenService.getUser();
  }

  ngOnInit(): void {
    if (this.isTelewiz) {
      this.readCardflowPC();
    }
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
    if (!this.profile) {
      this.alertService.error('ไม่สามารถอ่านบัตรประชาชนได้ กรุณาติดต่อพนักงาน');
      this.validateCustomerIdcard.koiskApiFn.removedState().subscribe((removed: boolean) => {
        if (removed) {
          this.validateCustomerIdcard.ngOnDestroy();
          this.validateCustomerIdcard.ngOnInit();
        }
      });

    }
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol)
      .then((zipCode: string) => {
        return this.customerInfoService.getCustomerInfoByIdCard(this.profile.idCardNo).then((customer: Customer) => {
          return {
            caNumber: customer.caNumber,
            mainMobile: customer.mainMobile,
            billCycle: customer.billCycle,
            zipCode: zipCode
          };
        }).catch(() => {
          return { zipCode: zipCode };
        });
      }).then((customer: any) => {
        this.transaction.data.customer = { ...this.profile, ...customer };
        this.transaction.data.billingInformation = {};
        const addressCustomer = this.transaction.data.customer;
        this.transaction.data.billingInformation.billDeliveryAddress = {
          homeNo: addressCustomer.homeNo,
          moo: addressCustomer.moo,
          mooBan: addressCustomer.mooBan,
          room: addressCustomer.room,
          floor: addressCustomer.floor,
          buildingName: addressCustomer.buildingName,
          soi: addressCustomer.soi,
          street: addressCustomer.street,
          province: addressCustomer.province,
          amphur: addressCustomer.amphur,
          tumbol: addressCustomer.tumbol,
          zipCode: addressCustomer.zipCode
        };
        if (this.transaction.data.order && this.transaction.data.order.soId) {
          this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE]);
          return;
        }
        return this.http.post('/api/salesportal/add-device-selling-cart',
          this.getRequestAddDeviceSellingCart()
        ).toPromise()
          .then((resp: any) => {
            this.transaction.data.order = { soId: resp.data.soId };
            return this.sharedTransactionService.createSharedTransaction(this.transaction, this.priceOption);
          }).then(() => {
            this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_CUSTOMER_INFO_PAGE]);
          });
      }).then(() => this.pageLoadingService.closeLoading());
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_ASP_BEST_BUY_VALIDATE_CUSTOMER_PAGE]);
  }

  ngOnDestroy(): void {
    if (this.readCardSubscription) {
      this.readCardSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

  getRequestAddDeviceSellingCart(): any {
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const customer = this.transaction.data.customer;
    const preBooking: Prebooking = this.transaction.data.preBooking;
    return {
      soCompany: productStock.company || 'AWN',
      locationSource: this.user.locationCode,
      locationReceipt: this.user.locationCode,
      productType: productDetail.productType || 'DEVICE',
      productSubType: productDetail.productSubType || 'HANDSET',
      brand: productDetail.brand || productStock.brand,
      model: productDetail.model || productStock.model,
      color: productStock.color  || productStock.colorName,
      priceIncAmt: '',
      priceDiscountAmt: '',
      grandTotalAmt: '',
      userId: this.user.username,
      cusNameOrder: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '-',
      preBookingNo: preBooking ? preBooking.preBookingNo : '',
      depositAmt: preBooking ? preBooking.depositAmt : '',
      reserveNo: preBooking ? preBooking.reserveNo : ''
    };
  }

  getZipCode(province: string, amphur: string, tumbol: string): Promise<string> {
    province = province.replace(/มหานคร$/, '');
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        const provinceId = (resp.data.provinces.find((prov: any) => prov.name === province) || {}).id;

        return this.http.get(`/api/customerportal/newRegister/queryZipcode`, {
          params: {
            provinceId: provinceId,
            amphurName: amphur,
            tumbolName: tumbol
          }
        }).toPromise();

      })
      .then((resp: any) => {
        if (resp.data.zipcodes && resp.data.zipcodes.length > 0) {
          return resp.data.zipcodes[0];
        } else {
          return Promise.reject('ไม่พบรหัสไปรษณีย์');
        }
      });
  }

  readCardflowPC(): void {
    this.readCardSubscription = this.readCardService.onReadCard().subscribe((readCard: ReadCard) => {
      this.readCard = readCard;

      this.progress = readCard.progress;
      const valid = !!(readCard.progress >= 100 && readCard.profile);
      if (readCard.error) {
        this.showProgress = false;
        this.profile = null;
      }

      if (readCard.eventName === ReadCardEvent.EVENT_CARD_LOAD_ERROR) {
        this.error = valid;
      }

      if (valid) {
        this.showProgress = true;
        this.profile = readCard.profile;

        if (!this.kioskApi) {
          this.profile = readCard.profile;
        }
      }

    });
  }

}
