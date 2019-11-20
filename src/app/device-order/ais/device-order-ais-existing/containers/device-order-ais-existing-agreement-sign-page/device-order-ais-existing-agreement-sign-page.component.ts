import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, User, AisNativeService, TokenService, ChannelType, ShoppingCart, AlertService } from 'mychannel-shared-libs';
import {
  ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_EXISTING_ECONTRACT
} from '../../constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-device-order-ais-existing-agreement-sign-page',
  templateUrl: './device-order-ais-existing-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-existing-agreement-sign-page.component.scss']
})
export class DeviceOrderAisExistingAgreementSignPageComponent implements OnInit, OnDestroy {

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
    this.signedSignatureSubscription = this.aisNativeDeviceService.getSigned()
    .subscribe((signature: string) => {
      this.isOpenSign = false;
      this.checkSignature(signature);
    });

    this.currentLang = this.translationService.currentLang || 'TH';
    this.translationSubscribe = this.translationService.onLangChange.subscribe((lang: any) => {
      this.checkLanguage(lang);
    });
  }

  checkLanguage(lang: any): void {
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
    if (this.isOpenSign) {
      this.onSigned();
    }
  }

  checkSignature(signature: string): void {
    if (signature) {
      this.isOpenSign = false;
      this.transaction.data.customer.imageSignature = signature;
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE]);
    } else {
      this.alertService.warning(this.currentLang === 'TH' ? 'กรุณาเซ็นลายเซ็น' : 'Please Sign').then(() => {
        this.onSigned();
      });
    }
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_ECONTRACT]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_AGGREGATE_PAGE]);
      }
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkLogicNext(): boolean {
    return this.isOpenSign || this.transaction.data.customer.imageSignature ? true : false;
  }

  onSigned(): void {
    this.isOpenSign = true;
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeDeviceService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'SignaturePad', `{x:100,y:280}`
    ).subscribe((command: any) => {
      this.openSignedCommand = command;
    });
  }

  getOnMessageWs(): void {
    this.commandSigned.ws.send('CaptureImage');
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    if (this.signedSignatureSubscription) {
      this.signedSignatureSubscription.unsubscribe();
    }
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
