import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService, ChannelType, User, Utils } from 'mychannel-shared-libs';
import * as Moment from 'moment';
import { ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE, ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE } from 'src/app/order/order-blcok-chain/constants/route-path.constant';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
import { TranslateService } from '@ngx-translate/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-block-chain-agreement-sign-page',
  templateUrl: './order-block-chain-agreement-sign-page.component.html',
  styleUrls: ['./order-block-chain-agreement-sign-page.component.scss']
})
export class OrderBlockChainAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

  localTime: any;
  TIME_DIFF_FORMAT: string = 'DD/MM/YYYY';

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpen: Subscription;

  openSignedCommand: any;

  translationSubscribe: Subscription;
  currentLang: string;

  commandSigned: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeOrderService: AisNativeOrderService,
    private tokenService: TokenService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeOrderService.getSigned().subscribe((signature: string) => {
      if (signature) {
        this.transaction.data.customer.imageSignature = signature;
      } else {
        this.alertService.warning('กรุณาเซ็นลายเซ็น').then(() => {
          this.onSigned();
        });
        return;
      }
    });
  }

  ngOnInit(): void {
    this.localTime = Moment().format(this.TIME_DIFF_FORMAT);
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_ELIGIBLE_MOBILE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_ORDER_BLOCK_CHAIN_FACE_CAPTURE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkLogicNext(): boolean {
    if (this.transaction.data.customer.imageSignature) {
      return true;
    } else {
      return false;
    }
  }

  onSigned(): void {
    delete this.transaction.data.customer.imageSignature;
    const user: User = this.tokenService.getUser();
    this.signedOpen = this.aisNativeOrderService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'OnscreenSignpad', `{x:100,y:280,Language: ${this.currentLang}}`
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.signedSignatureSubscription.unsubscribe();
    if (this.signedOpen) {
      this.signedOpen.unsubscribe();
    }
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
