import { Component, OnInit, OnDestroy } from '@angular/core';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Subscription } from 'rxjs';
import { ShoppingCart, HomeService, TokenService, AlertService, User, ChannelType, CaptureAndSign } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_GADGET_CHECK_OUT_PAGE, ROUTE_DEVICE_ORDER_AIS_GADGET_ECONTRACT_PAGE } from '../../constants/route-path.constant';
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

  // captureAndSign
  shoppingCart: ShoppingCart;
  captureAndSign: CaptureAndSign;
  apiSigned: string;
  idCardValid: boolean;

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
    private tokenService: TokenService,
    private shoppingCartService: ShoppingCartService,
    private alertService: AlertService,
    private translationService: TranslateService) {
    this.transaction = this.transactionService.load();
    if (this.tokenService.getUser().channelType === ChannelType.SMART_ORDER) {
      this.apiSigned = 'OnscreenSignpad';
    } else {
      this.apiSigned = 'SignaturePad';
    }
  }

  ngOnInit(): void {
    this.checkCaptureAndSign();
  }

  checkCaptureAndSign(): void {
    const customer: Customer = this.transaction.data.customer;
    if (this.transaction.data.action === 'READ_CARD') {
      this.captureAndSign = {
        allowCapture: false,
        imageSmartCard: customer.imageSmartCard,
        imageSignature: customer.imageSignatureSmartCard
      };
    } else {
      this.captureAndSign = {
        allowCapture: true,
        imageSmartCard: customer.imageSmartCard,
        imageSignature: customer.imageSignatureSmartCard
      };
    }
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  onError(valid: boolean): void {
    this.idCardValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_ECONTRACT_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_GADGET_CHECK_OUT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
