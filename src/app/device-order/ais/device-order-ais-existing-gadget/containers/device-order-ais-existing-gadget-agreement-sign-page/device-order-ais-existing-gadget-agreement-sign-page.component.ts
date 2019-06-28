import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Subscription } from 'rxjs';
import { ShoppingCart, HomeService, TokenService, AlertService, User, ChannelType } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_CHECK_OUT_PAGE } from '../../constants/route-path.constant';
import { DeviceOrderAisExistingGadgetEcontractPageComponent } from '../device-order-ais-existing-gadget-econtract-page/device-order-ais-existing-gadget-econtract-page.component';

@Component({
  selector: 'app-device-order-ais-existing-gadget-agreement-sign-page',
  templateUrl: './device-order-ais-existing-gadget-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-existing-gadget-agreement-sign-page.component.scss']
})
export class DeviceOrderAisExistingGadgetAgreementSignPageComponent implements OnInit, OnDestroy {

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
    private translationService: TranslateService) {
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

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
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
      this.router.navigate([DeviceOrderAisExistingGadgetEcontractPageComponent]);
    } else {
      this.alertService.warning('กรุณาเซ็นลายเซ็น').then(() => {
        this.onSigned();
      });
    }
  }
  onBack(): void {
    this.router.navigate([DeviceOrderAisExistingGadgetEcontractPageComponent]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CHECK_OUT_PAGE]);
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

  ngOnDestroy(): void {
    this.signedSignatureSubscription.unsubscribe();
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
