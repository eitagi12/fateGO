import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AisNativeService, TokenService, User, ChannelType } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_PRE_TO_POST_SUMMARY_PAGE, ROUTE_ORDER_PRE_TO_POST_AGGREGATE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-order-pre-to-post-agreement-sign-page',
  templateUrl: './order-pre-to-post-agreement-sign-page.component.html',
  styleUrls: ['./order-pre-to-post-agreement-sign-page.component.scss']
})
export class OrderPreToPostAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  signedSubscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeService,
    private tokenService: TokenService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
      this.transaction.data.customer.imageSignature = signature;
    });
  }

  ngOnInit() {
    this.onSigned();
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SUMMARY_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_AGGREGATE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSigned() {
    const user: User = this.tokenService.getUser();
    this.aisNativeService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'OnscreenSignpad'
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.signedSubscription.unsubscribe();
    this.transactionService.update(this.transaction);
  }
}
