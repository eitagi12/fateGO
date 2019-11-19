import { Component, OnInit, OnDestroy } from '@angular/core';
import { CreateEapplicationService } from 'src/app/shared/services/create-eapplication.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { HomeService, PageLoadingService, ShoppingCart } from 'mychannel-shared-libs';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_AGGREGATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MASTER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE } from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-new-register-mnp-eapplication-page',
  templateUrl: './new-register-mnp-eapplication-page.component.html',
  styleUrls: ['./new-register-mnp-eapplication-page.component.scss']
})
export class NewRegisterMnpEapplicationPageComponent implements OnInit, OnDestroy {
  selectedTab: string = 'hotdeal-superkhum-new-register';
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  shoppingCart: ShoppingCart;
  transaction: Transaction;
  eApplicationSuperKhumNew: string;
  eApplicationSuperKhumMnp: string;
  isSelect: boolean;
  translationSubscribe: Subscription;
  constructor(private router: Router,
    private createEapplicationService: CreateEapplicationService,
    private transactionService: TransactionService,
    private homeService: HomeService,
    private pageLoadingService: PageLoadingService,
    private translateService: TranslateService,
    private shoppingCartService: ShoppingCartService) {
    this.transaction = this.transactionService.load();
  }

  selectEapplication(tab: string): void {
    this.isSelect = (tab === 'hotdeal-superkhum-new-register') ? false : true; // Compare to show eApp new, mnp.
    this.selectedTab = tab;
  }

  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    this.callGenerateEappService(this.transaction, this.translateService.currentLang);
    this.isSelect = this.eApplicationSuperKhumNew ? true : false; // Get eApp for new ca first.
  }

  callGenerateEappService(transaction: Transaction, language: string): void {
    this.createEapplicationService.createEapplicationSuperKhumSharepalnNewRegister(transaction, language)
      .then((res: any) => {  // Generate Eapp for new ca
        this.eApplicationSuperKhumNew = res.data;
      }).then(() => {// Generate Eapp for new mnp
        this.createEapplicationService.createEapplicationSuperKhumSharepalnMnp(transaction, language).then((res) => {
          this.eApplicationSuperKhumMnp = res.data;
        });
      }).then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE]);
  }

  onNext(): void {
    if (this.transaction.data.simCard.persoSim) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MASTER_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_PERSO_SIM_MEMBER_PAGE]);
    }
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
