import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WIZARD_ORDER_PRE_TO_POST } from 'src/app/order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { HomeService, AisNativeService, TokenService, User, ChannelType, AlertService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import {
  ROUTE_ORDER_PRE_TO_POST_SUMMARY_PAGE, ROUTE_ORDER_PRE_TO_POST_AGGREGATE_PAGE
} from 'src/app/order/order-pre-to-post/constants/route-path.constant';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
@Component({
  selector: 'app-order-pre-to-post-agreement-sign-page',
  templateUrl: './order-pre-to-post-agreement-sign-page.component.html',
  styleUrls: ['./order-pre-to-post-agreement-sign-page.component.scss']
})
export class OrderPreToPostAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards = WIZARD_ORDER_PRE_TO_POST;

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpenSubscription: Subscription;
  openSignedCommand: any;
  isOpenSign: boolean;
  currentLang: string;
  translationSubscribe: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private translationService: TranslateService,
    private aisNativeOrderService: AisNativeOrderService,
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
      this.isOpenSign = false;
      if (signature) {
        this.transaction.data.customer.imageSignature = signature;
      } else {
        this.isOpenSign = true;
        this.alertService.warning(this.translationService.instant('กรุณาเซ็นลายเซ็น')).then(() => {
          this.onSigned();
        });
        return;
      }
    });

    this.currentLang = this.translationService.currentLang || 'TH';
    this.translationSubscribe = this.translationService.onLangChange.subscribe(lang => {
      if (this.signedOpenSubscription) {
        this.signedOpenSubscription.unsubscribe();
      }
      this.currentLang = typeof (lang) === 'object' ? lang.lang : lang;
      if (this.isOpenSign) {
        this.onSigned();
      }
    });
  }

  checkLogicNext(): boolean {
    if (this.isOpenSign || this.transaction.data.customer.imageSignature) {
      return true;
    } else {
      return false;
    }
  }

  ngOnInit() {
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_PRE_TO_POST_SUMMARY_PAGE]);
  }

  onNext() {
    if (this.transaction.data.customer.imageSignature) {
      this.router.navigate([ROUTE_ORDER_PRE_TO_POST_AGGREGATE_PAGE]);
    } else {
      if (this.openSignedCommand && !this.openSignedCommand.error) {
        this.openSignedCommand.ws.send('CaptureImage');
      }
    }
  }

  onHome() {
    this.homeService.goToHome();
  }

  onSigned() {
    this.isOpenSign = true;
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeOrderService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'SignaturePad', `{x:100,y:280,Language: ${this.currentLang}}`
    ).subscribe((command: any) => {
      this.openSignedCommand = command;
    });
  }

  ngOnDestroy(): void {
    this.signedSignatureSubscription.unsubscribe();
    if (this.signedOpenSubscription) {
      this.signedOpenSubscription.unsubscribe();
    }
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }
}
