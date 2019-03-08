import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, ReadCardProfile, TokenService, User, PageLoadingService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-new-register-validate-customer-id-card-page',
  templateUrl: './device-order-ais-new-register-validate-customer-id-card-page.component.html',
  styleUrls: ['./device-order-ais-new-register-validate-customer-id-card-page.component.scss']
})
export class DeviceOrderAisNewRegisterValidateCustomerIdCardPageComponent implements OnInit, OnDestroy {
  transaction: Transaction;
  profile: ReadCardProfile;
  zipcode: string;
  readCardValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.createTransaction();
  }

  onError(valid: boolean): void {
    this.readCardValid = valid;
  }

  onCompleted(profile: ReadCardProfile): void {
    this.profile = profile;
    this.getZipCode(this.profile.province, this.profile.amphur, this.profile.tumbol);
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    const user: User = this.tokenService.getUser();
    this.http.get(`/api/customerportal/newRegister/${this.profile.idCardNo}/queryCustomerInfo`).toPromise()
      .then((resp: any) => {
        this.mapCustomer(resp.data);
        return this.http.get(`/api/customerportal/customerprofile/${this.profile.idCardNo}/${user.username}/app3steps`).toPromise();
      })
      .then((resp: any) => {
        return this.http.get(`/api/customerportal/asset/${this.profile.idCardNo}/contracts`).toPromise();
      })
      .then((resp: any) => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PAYMENT_DETAIL_PAGE]);
      })
      .catch(() => {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_VALIDATE_CUSTOMER_KEY_IN_PAGE], {
          queryParams: {
            idCardNo: this.profile.idCardNo
          }
        });
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  getZipCode(province: string, amphur: string, tumbol: string): void {
    province = province.replace(/มหานคร$/, '');
    this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise()
      .then((resp: any) => {
        const provinceId = (resp.data.provinces.find((prov: any) => prov.name === province) || {}).id;

        return this.http.get(
          `/api/customerportal/newRegister/queryZipcode?provinceId=${provinceId}&amphurName=${amphur}&tumbolName=${tumbol}`
        ).toPromise();
      })
      .then((resp: any) => {
        if (resp.data.zipcodes && resp.data.zipcodes.length > 0) {
          console.log(resp.data.zipcodes[0]);
        }
      });
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    // this.transaction = {
    //   data: {
    //     transactionType: TransactionType.DEVICE_ORDER_EXISTING_AIS,
    //     action: TransactionAction.KEY_IN,
    //   }
    // };
    // delete this.transaction.data.customer;
  }

  private mapCustomer(customer: any): void {
    const fullName = (customer.name || ' ').split(' ');
    const address = customer.address || {};

    this.transaction.data.customer = {
      idCardNo: this.profile.idCardNo,
      idCardType: customer.idCardType,
      titleName: customer.accntTitle,
      firstName: fullName[0],
      lastName: fullName[1],
      birthdate: customer.birthdate,
      gender: customer.gender,
      homeNo: address.homeNo,
      moo: address.moo,
      mooBan: address.mooban,
      buildingName: address.buildingName,
      floor: address.floor,
      room: address.room,
      street: address.street,
      soi: address.soi,
      tumbol: address.tumbol,
      amphur: address.amphur,
      province: address.province,
      firstNameEn: this.profile.firstNameEn,
      lastNameEn: this.profile.lastNameEn,
      issueDate: customer.birthdate,
      expireDate: this.profile.expireDate,
      zipCode: address.zipCode,
      mainMobile: customer.mainMobile,
      mainPhone: customer.mainPhone,
      billCycle: customer.billCycle,
      caNumber: customer.accntNo,
      imageSignature: '',
      imageSmartCard: '',
      imageReadSmartCard: this.profile.imageReadSmartCard,
    };
  }

}
