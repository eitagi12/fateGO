import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ODER_AIS_DEVICE } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { CustomerAddress, HomeService, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-device-eshipping-address-page',
  templateUrl: './device-order-ais-device-eshipping-address-page.component.html',
  styleUrls: ['./device-order-ais-device-eshipping-address-page.component.scss']
})
export class DeviceOrderAisDeviceEshippingAddressPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ODER_AIS_DEVICE;

  transaction: Transaction;
  priceOption: PriceOption;
  shippingAddress: CustomerAddress;
  allZipCodes: string[];
  provinces: any[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];
  shippinAddressTemp: CustomerAddress;
  eShippingValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
    if (this.transaction && this.transaction.data && this.transaction.data.order && this.transaction.data.order.soId) {
      this.homeService.callback = () => {
        this.alertService.question('ต้องการยกเลิกรายการขายหรือไม่ การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที', 'ตกลง', 'ยกเลิก')
          .then((response: any) => {
            if (response.value === true) {
              this.returnStock().then(() => {
                this.transaction.data.order = {};
                this.transactionService.remove();
                window.location.href = '/';
              });
            }
          });
      };
    }
  }

  ngOnInit(): void {
    this.callService();
  }

  callService(): void {
    const shippingInfo: any = this.transaction.data && this.transaction.data.shippingInfo ? this.transaction.data.shippingInfo : {};
    this.http.get('/api/customerportal/newRegister/getAllZipcodes').subscribe((resp: any) => {
      this.allZipCodes = resp.data.zipcodes || [];
    });

    this.http.get('/api/customerportal/newRegister/getAllProvinces',
      {
        params: {
          provinceSubType: 'THA'
        }
      }).subscribe((resp: any) => {
        this.provinces = (resp.data.provinces || []);
        this.shippingAddress = {
          homeNo: shippingInfo.homeNo,
          moo: shippingInfo.moo,
          mooBan: shippingInfo.mooBan,
          room: shippingInfo.room,
          floor: shippingInfo.floor,
          buildingName: shippingInfo.buildingName,
          soi: shippingInfo.soi,
          street: shippingInfo.street,
          province: shippingInfo.province,
          amphur: shippingInfo.amphur,
          tumbol: shippingInfo.tumbol,
          zipCode: shippingInfo.zipCode,
        };
      });
  }

  getProvinces(): string[] {
    return (this.provinces || []).map((province: any) => {
      return province.name;
    });
  }

  getProvinceByName(provinceName: string): any {
    return (this.provinces || []).find((prov: any) => prov.name === provinceName) || {};
  }

  onProvinceSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id
    };

    this.http.get('/api/customerportal/newRegister/queryAmphur', {
      params: req
    }).subscribe((resp: any) => {
      this.amphurs = (resp.data.amphurs || []).map((amphur: any) => {
        return amphur;
      });
    });
  }

  onAmphurSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    const req = {
      provinceId: province.id,
      amphurName: params.amphurName
    };

    this.http.get('/api/customerportal/newRegister/queryTumbol', {
      params: req
    }).subscribe((resp: any) => {
      this.tumbols = (resp.data.tumbols || []).map((tumbol: any) => {
        return tumbol;
      });
    });
  }

  onTumbolSelected(params: any): void {
    const province = this.getProvinceByName(params.provinceName);
    this.http.get('/api/customerportal/newRegister/queryZipcode', {
      params: {
        provinceId: province.id,
        amphurName: params.amphurName,
        tumbolName: params.tumbolName
      }
    }).subscribe((resp: any) => {
      this.zipCodes = resp.data.zipcodes || [];
    });
  }

  onZipCodeSelected(zipCode: string): void {
    this.http.get('/api/customerportal/newRegister/getProvinceIdByZipcode', {
      params: { zipcode: zipCode }
    }).toPromise()
      .then((resp: any) => {
        const province = this.provinces.find((prov: any) => prov.id === resp.data.provinceId);
        if (!province) {
          return;
        }
        this.shippingAddress = Object.assign(
          Object.assign({}, this.shippingAddress),
          {
            province: province.name,
            zipCode: zipCode
          }
        );
      });
  }

  onCompleted(value: any): void {
    this.shippinAddressTemp = value;
  }

  onError(valid: boolean): void {
    this.eShippingValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.transaction.data.shippingInfo = Object.assign(this.transaction.data.shippingInfo,
      this.shippinAddressTemp);
    this.router.navigate([ROUTE_DEVICE_AIS_DEVICE_SUMMARY_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  returnStock(): Promise<void> {
    return new Promise(resolve => {
      const transaction = this.transactionService.load();
      const promiseAll = [];
      if (transaction.data) {
        if (transaction.data.order && transaction.data.order.soId) {
          const order = this.http.post('/api/salesportal/device-sell/item/clear-temp-stock', {
            location: this.priceOption.productStock.location,
            soId: transaction.data.order.soId,
            transactionId: transaction.transactionId
          }).toPromise().catch(() => Promise.resolve());
          promiseAll.push(order);
        }
      }
      Promise.all(promiseAll).then(() => resolve());
    });
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }

  getAllProvince(): Promise<any> {
    return this.http.get('/api/customerportal/newRegister/getAllProvinces').toPromise();
  }

}
