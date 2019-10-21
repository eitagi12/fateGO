import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { HomeService, TokenService, ShoppingCart, CaptureAndSign } from 'mychannel-shared-libs';
import { Transaction, Customer } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { AgreementSignConstant } from '../../constants/agreement-sign.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_ECONTACT_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_FACE_CAPTURE_PAGE
} from '../../constants/route-path.constant';

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

  idCardValid: boolean;
  apiSigned: string;
  conditionText: string;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private tokenService: TokenService,
    private shoppingCartService: ShoppingCartService
  ) {
    this.transaction = this.transactionService.load();
    this.apiSigned = 'SignaturePad';
  }

  ngOnInit(): void {
    this.shoppingCart = this.shoppingCartService.getShoppingCartData();
    const customer: Customer = this.transaction.data.customer;
    this.conditionText = AgreementSignConstant.NEW_REGISTER_SIGN;
    this.captureAndSign = {
      allowCapture: true,
      imageSmartCard: customer.imageSmartCard,
      imageSignature: customer.imageReadSmartCard
    };

    console.log('captureAndSign |', this.captureAndSign);
  }

  onCompleted(captureAndSign: CaptureAndSign): void {
    console.log('captureAndSign', captureAndSign);
    const customer: Customer = this.transaction.data.customer;
    customer.imageSignature = captureAndSign.imageSignature;
    customer.imageSmartCard = captureAndSign.imageSmartCard;
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
