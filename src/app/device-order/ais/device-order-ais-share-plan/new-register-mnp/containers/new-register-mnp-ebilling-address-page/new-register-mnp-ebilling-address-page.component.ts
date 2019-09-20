import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, CustomerAddress } from 'mychannel-shared-libs';
import { HttpClient } from '@angular/common/http';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../../constants/wizard.constant';
// import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE } from '../../constants/route-path.constant';
@Component({
  selector: 'app-new-register-mnp-ebilling-address-page',
  templateUrl: './new-register-mnp-ebilling-address-page.component.html',
  styleUrls: ['./new-register-mnp-ebilling-address-page.component.scss']
})
export class NewRegisterMnpEbillingAddressPageComponent implements OnInit, OnDestroy {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  customerAddress: CustomerAddress;
  allZipCodes: string[];
  provinces: any[];
  amphurs: string[];
  tumbols: string[];
  zipCodes: string[];

  customerAddressTemp: CustomerAddress;
  billDeliveryAddress: CustomerAddress;
  translationSubscribe: Subscription;
  ebillingAddressValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private http: HttpClient,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    // this.callService();
    this.translationSubscribe = this.translation.onLangChange.pipe(debounceTime(750)).subscribe(() => {
      // this.callService();
      this.amphurs = [];
      this.tumbols = [];
      this.zipCodes = [];
      this.customerAddress.amphur = null;
      this.customerAddress.tumbol = null;
      this.customerAddress.province = null;
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

  onCompleted(value: any): void {
    this.customerAddressTemp = value;
  }

  onError(valid: boolean): void {
    this.ebillingAddressValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
