import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, TokenService, User, ChannelType, AlertService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_MNP_SUMMARY_PAGE,
  ROUTE_ORDER_MNP_EAPPLICATION_PAGE
} from 'src/app/order/order-mnp/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
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

  commandSigned: any;
  isOpenSign: boolean;
  currentLang: string;
  translationSubscribe: Subscription;

  openSignedCommand: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeOrderService: AisNativeOrderService,
    private tokenService: TokenService,
    private alertService: AlertService,
    private translationService: TranslateService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeOrderService.getSigned().subscribe((signature: string) => {
      this.isOpenSign = false;
      if (signature) {
        this.transaction.data.customer.imageSignature = signature;
        this.router.navigate([ROUTE_ORDER_MNP_EAPPLICATION_PAGE]);
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

  ngOnInit() {
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  checkLogicNext(): boolean {
    if (this.isOpenSign || this.transaction.data.customer.imageSignature) {
      return true;
    } else {
      return false;
    }
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

  getOnMessageWs() {
    this.commandSigned.ws.send('CaptureImage');
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_MNP_SUMMARY_PAGE]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.router.navigate([ROUTE_ORDER_MNP_EAPPLICATION_PAGE]);
      }
    }
  }

  onHome(): void {
    this.homeService.goToHome();
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
