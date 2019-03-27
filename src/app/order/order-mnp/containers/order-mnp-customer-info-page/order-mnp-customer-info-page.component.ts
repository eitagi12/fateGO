import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Transaction, Customer, TransactionAction } from 'src/app/shared/models/transaction.model';
import { CustomerInfo, HomeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_MNP_ID_CARD_CAPTURE_PAGE,
  ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE,
  ROUTE_ORDER_MNP_PASSPOPRT_INFO_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-mnp-customer-info-page',
  templateUrl: './order-mnp-customer-info-page.component.html',
  styleUrls: ['./order-mnp-customer-info-page.component.scss']
})
export class OrderMnpCustomerInfoPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_MNP;

  transaction: Transaction;
  customerInfo: CustomerInfo;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    public translateService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.translationSubscribe = this.translateService.onLangChange.subscribe(() => {
      this.mapCustomerInfoByLang();
    });
  }

  ngOnInit(): void {
    const customer: Customer = this.transaction.data.customer;
    this.customerInfo = {
      titleName: customer.titleName,
      firstName: customer.firstName,
      lastName: customer.lastName,
      idCardNo: customer.idCardNo,
      idCardType: this.translateService.instant(customer.idCardType),
      birthdate: customer.birthdate,
      mobileNo: customer.mainMobile,
    };
  }

  mapCustomerInfoByLang(): void {
    const customer: Customer = this.transaction.data.customer;
    this.customerInfo.idCardType = this.translateService.instant(customer.idCardType);
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_MNP_PASSPOPRT_INFO_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.action === TransactionAction.KEY_IN) {
      this.router.navigate([ROUTE_ORDER_MNP_ID_CARD_CAPTURE_PAGE]);
    } else {
      this.router.navigate([ROUTE_ORDER_MNP_SELECT_PACKAGE_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.translationSubscribe.unsubscribe();
    this.transactionService.save(this.transaction);
  }

}
