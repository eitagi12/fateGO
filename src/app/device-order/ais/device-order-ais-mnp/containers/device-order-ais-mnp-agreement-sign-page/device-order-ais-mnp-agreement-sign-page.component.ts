import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';
import { ShoppingCart, HomeService, AisNativeService, TokenService, User, ChannelType, AlertService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { ROUTE_DEVICE_ORDER_AIS_MNP_SUMMARY_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_ECONTACT_PAGE } from '../../constants/route-path.constant';
import { TranslateService } from '@ngx-translate/core';
import { AisNativeMnpService } from '../../services/ais-native-mnp-services.service';

@Component({
  selector: 'app-device-order-ais-mnp-agreement-sign-page',
  templateUrl: './device-order-ais-mnp-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-mnp-agreement-sign-page.component.scss']
})
export class DeviceOrderAisMnpAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpenSubscription: Subscription;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeService,
    private tokenService: TokenService,
    private shoppingCartService: ShoppingCartService,
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
      this.transaction.data.customer.imageSignature = signature;
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_ECONTACT_PAGE]);
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onSigned(): void {
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'SignaturePad'
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.signedSignatureSubscription.unsubscribe();
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
