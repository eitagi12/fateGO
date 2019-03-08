import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, User, TokenService, ChannelType } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_RESULT_PAGE,
  ROUTE_ORDER_NEW_REGISTER_PERSO_SIM_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE,
  ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-order-new-register-agreement-sign-page',
  templateUrl: './order-new-register-agreement-sign-page.component.html',
  styleUrls: ['./order-new-register-agreement-sign-page.component.scss']
})
export class OrderNewRegisterAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

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

  ngOnInit(): void {
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE]);
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
