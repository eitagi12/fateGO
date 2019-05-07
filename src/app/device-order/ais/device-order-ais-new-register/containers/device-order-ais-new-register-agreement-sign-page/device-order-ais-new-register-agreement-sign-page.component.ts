import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, User, TokenService, ChannelType, ShoppingCart, AlertService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Subscription } from 'rxjs';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';

@Component({
  selector: 'app-device-order-ais-new-register-agreement-sign-page',
  templateUrl: './device-order-ais-new-register-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-new-register-agreement-sign-page.component.scss']
})
export class DeviceOrderAisNewRegisterAgreementSignPageComponent implements OnInit, OnDestroy {

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
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeDeviceService: AisNativeDeviceService,
    private tokenService: TokenService,
    private shoppingCartService: ShoppingCartService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeDeviceService.getSigned().subscribe((signature: string) => {
      this.isOpenSign = false;
      if (signature) {
        this.isOpenSign = false;
        this.transaction.data.customer.imageSignature = signature;
        this.nextRouteLogic();
      } else {
        this.alertService.warning('กรุณาเซ็นลายเซ็น').then(() => {
          this.onSigned();
        });
        return;
      }
    });
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

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.nextRouteLogic();
      }
    }
  }

  nextRouteLogic(): void {
    if (this.transaction.data.simCard.simSerial) {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE]);
    } else {
      this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_PERSO_SIM_PAGE]);
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onSigned(): void {
    this.isOpenSign = true;
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeDeviceService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'OnscreenSignpad', `{x:100,y:280}`
    ).subscribe((command: any) => {
      this.openSignedCommand = command;
    });
  }

  ngOnDestroy(): void {
    this.signedSignatureSubscription.unsubscribe();
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
