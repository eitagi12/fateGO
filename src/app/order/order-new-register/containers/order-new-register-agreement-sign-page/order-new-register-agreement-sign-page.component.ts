import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, AisNativeService, User, TokenService, ChannelType, AlertService } from 'mychannel-shared-libs';
import {
  ROUTE_ORDER_NEW_REGISTER_RESULT_PAGE,
  ROUTE_ORDER_NEW_REGISTER_PERSO_SIM_PAGE,
  ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE,
  ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE
} from 'src/app/order/order-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Subscription } from 'rxjs';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
import { TranslateService } from '@ngx-translate/core';
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
  openSignedCommand: any;
  isOpenSign: boolean;

  translationSubscribe: Subscription;
  currentLang: string;

  commandSigned: any;

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
        this.isOpenSign = false;
        this.transaction.data.customer.imageSignature = signature;
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE]);
      } else {
        this.alertService.warning('กรุณาเซ็นลายเซ็น').then(() => {
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

  ngOnInit(): void {
    if (!this.transaction.data.customer.imageSignature) {
      this.onSigned();
    }
  }

  onBack(): void {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_SUMMARY_PAGE]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.router.navigate([ROUTE_ORDER_NEW_REGISTER_EAPPLICATION_PAGE]);
      }
    }
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkLogicNext(): boolean {
    if (this.isOpenSign || this.transaction.data.customer.imageSignature) {
      return true;
    } else {
      return false;
    }
  }

  onSigned(): void {
    this.isOpenSign = true;
    const user: User = this.tokenService.getUser();
    this.signedOpenSubscription = this.aisNativeOrderService.openSigned(
      ChannelType.SMART_ORDER === user.channelType ? 'OnscreenSignpad' : 'OnscreenSignpad', `{x:100,y:280,Language: ${this.currentLang}}`
    ).subscribe((command: any) => {
      this.openSignedCommand = command;
    });

  }

  getOnMessageWs(): void {
    this.commandSigned.ws.send('CaptureImage');
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
