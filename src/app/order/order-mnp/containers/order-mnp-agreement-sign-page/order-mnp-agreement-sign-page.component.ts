import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, TokenService, User, ChannelType } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_SUMMARY_PAGE,
  ROUTE_ORDER_MNP_EAPPLICATION_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { CreateNewRegisterService } from 'src/app/shared/services/create-new-register.service';
@Component({
  selector: 'app-order-mnp-agreement-sign-page',
  templateUrl: './order-mnp-agreement-sign-page.component.html',
  styleUrls: ['./order-mnp-agreement-sign-page.component.scss']
})
export class OrderMnpAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_MNP;

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpenSubscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeService,
    private tokenService: TokenService,
    private createNewRegisterService: CreateNewRegisterService
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
    this.router.navigate([ROUTE_ORDER_MNP_SUMMARY_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_MNP_EAPPLICATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSigned() {
    const user: User = this.tokenService.getUser();
    this.transaction.data.customer.imageSignature = '';
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
