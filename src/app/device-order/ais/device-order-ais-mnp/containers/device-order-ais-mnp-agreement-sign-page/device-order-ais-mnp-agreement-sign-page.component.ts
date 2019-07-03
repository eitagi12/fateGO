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
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';

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

  // signature
  signatureImage: string;
  commandSigned: any;
  openSignedCommand: any;
  isOpenSign: boolean;

  translationSubscribe: Subscription;
  currentLang: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeDeviceService: AisNativeDeviceService,
    private tokenService: TokenService,
    private shoppingCartService: ShoppingCartService,
    private alertService: AlertService,
    private translationService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeDeviceService.getSigned().subscribe((signature: string) => {
      this.isOpenSign = false;
      if (signature) {
        this.isOpenSign = false;
        this.transaction.data.customer.imageSignature = signature;
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE]);
      } else {
        this.alertService.warning(this.currentLang === 'TH' ? 'กรุณาเซ็นลายเซ็น' : 'Please Sign').then(() => {
          this.onSigned();
        });
        return;
      }
    });

    this.currentLang = this.translationService.currentLang || 'TH';
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      if (this.signedOpenSubscription) {
        this.signedOpenSubscription.unsubscribe();
      }
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      if (this.isOpenSign) {
        this.onSigned();
      }
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

  checkLogicNext(): boolean {
    return this.isOpenSign || this.transaction.data.customer.imageSignature ? true : false;
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_AGGREGATE_PAGE]);
      }
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onSigned(): void {
    this.isOpenSign = true;
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeDeviceService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'OnscreenSignpad', `{x:100,y:280,Language: ${this.currentLang}}`
    ).subscribe((command: any) => {
      this.openSignedCommand = command;
    });

  }

  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.signedSignatureSubscription.unsubscribe();
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
