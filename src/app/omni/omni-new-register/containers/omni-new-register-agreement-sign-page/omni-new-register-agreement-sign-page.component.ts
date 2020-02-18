import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { Router } from '@angular/router';
import { HomeService, User, TokenService, ChannelType, AlertService } from 'mychannel-shared-libs';
import {
  ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE,
  ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE
} from 'src/app/omni/omni-new-register/constants/route-path.constant';
import { Subscription } from 'rxjs';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
@Component({
  selector: 'app-omni-new-register-agreement-sign-page',
  templateUrl: './omni-new-register-agreement-sign-page.component.html',
  styleUrls: ['./omni-new-register-agreement-sign-page.component.scss']
})
export class OmniNewRegisterAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpenSubscription: Subscription;
  openSignedCommand: any;
  isOpenSign: boolean;
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
      this.isOpenSign = false;
      if (signature) {
        this.isOpenSign = false;
        this.transaction.data.customer.imageSignature = signature;
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE]);
      } else {
        this.alertService.warning('กรุณาเซ็นลายเซ็น').then(() => {
          this.onSigned();
        });
        return;
      }
    });
  }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_ECONTRACT_PAGE]);
  }

  onNext(): void {
    if (this.openSignedCommand && !this.openSignedCommand.error) {
      this.openSignedCommand.ws.send('CaptureImage');
    } else {
      if (this.transaction.data.customer.imageSignature) {
        this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EAPPLICATION_PAGE]);
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
    this.transactionService.update(this.transaction);
  }
}
