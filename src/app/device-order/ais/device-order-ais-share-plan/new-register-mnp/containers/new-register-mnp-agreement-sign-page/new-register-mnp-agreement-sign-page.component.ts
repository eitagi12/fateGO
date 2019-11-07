import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HomeService, TokenService, ShoppingCart, CaptureAndSign, AlertService, User, ChannelType } from 'mychannel-shared-libs';
import { Transaction, Customer, SignatureAndImageSmartCard } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { AgreementSignConstant } from '../../constants/agreement-sign.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE
} from '../../constants/route-path.constant';
import { AisNativeDeviceService } from 'src/app/shared/services/ais-native-device.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-new-register-mnp-agreement-sign-page',
  templateUrl: './new-register-mnp-agreement-sign-page.component.html',
  styleUrls: ['./new-register-mnp-agreement-sign-page.component.scss']
})
export class NewRegisterMnpAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  shoppingCart: ShoppingCart;
  transaction: Transaction;
  captureAndSign: CaptureAndSign;
  signedSignatureSubscription: Subscription;
  idCardValid: boolean;
  apiSigned: string;
  conditionText: string;
  isOpenSign: boolean;
  openSignedCommand: any;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private shoppingCartService: ShoppingCartService,
    private aisNativeDeviceService: AisNativeDeviceService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    if (this.tokenService.getUser().channelType === ChannelType.MYCHANNEL_APP) {
      this.apiSigned = 'OnscreenSignpad';
    } else {
      this.apiSigned = 'SignaturePad';
    }
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const customer: Customer = this.transaction.data.customer;
    this.conditionText = AgreementSignConstant.NEW_REGISTER_SIGN;
    this.captureAndSign = {
      allowCapture: (this.transaction.data.action === 'READ_CARD') ? false : true,
      imageSignature: customer.imageSignatureSmartCard,
      imageSmartCard: (this.transaction.data.action === 'READ_CARD') ? customer.imageReadSmartCard : customer.imageSmartCard,
    };
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignatureSmartCard = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
  }

  // tslint:disable-next-line: typedef
  onSuccessCaptureAndSign(captureAndSign: any) {
    // tslint:disable-next-line: max-line-length
    const { signatureImage, smartCardImage, smartCardImageWithSignature, smartCardImageWithSignatureAndWatermak, imageSignatureOnly } = captureAndSign;
    let dataImage: SignatureAndImageSmartCard;
    if (signatureImage !== null) {
      dataImage = {
        dataSignature: '',
        dataImageSmartCard: ''
      };
    }
    localStorage.setItem('testSaveSignature', JSON.stringify(dataImage));
  }

  onError(valid: boolean): void {
    this.idCardValid = valid;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    if (this.transaction) {
      this.transactionService.update(this.transaction);
    }
  }

}
