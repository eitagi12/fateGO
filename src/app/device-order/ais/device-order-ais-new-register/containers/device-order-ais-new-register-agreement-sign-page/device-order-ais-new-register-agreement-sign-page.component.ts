import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, User, TokenService, ChannelType } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Subscription } from 'rxjs';
import { WIZARD_DEVICE_ORDER_AIS } from '../../../../constants/wizard.constant';
import { ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_SIGN_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_AGREEMENT_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_COMPARE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE, ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-device-order-ais-new-register-agreement-sign-page',
  templateUrl: './device-order-ais-new-register-agreement-sign-page.component.html',
  styleUrls: ['./device-order-ais-new-register-agreement-sign-page.component.scss']
})
export class DeviceOrderAisNewRegisterAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpenSubscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
      this.transaction.data.customer.imageSignature = signature;
    });
  }

  ngOnInit() {
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_EAPPLICATION_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_FACE_CAPTURE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSigned() {
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
