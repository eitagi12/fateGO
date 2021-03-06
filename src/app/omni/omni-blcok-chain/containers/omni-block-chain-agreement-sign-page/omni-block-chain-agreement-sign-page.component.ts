import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, TokenService, AlertService, User, AisNativeService } from 'mychannel-shared-libs';
import * as Moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { TranslateService } from '@ngx-translate/core';
import { WIZARD_OMNI_BLOCK_CHAIN } from 'src/app/omni/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Subscription } from 'rxjs';
import { ROUTE_OMNI_BLOCK_CHAIN_LOW_PAGE, ROUTE_OMNI_BLOCK_CHAIN_FACE_CAPTURE_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-omni-block-chain-agreement-sign-page',
  templateUrl: './omni-block-chain-agreement-sign-page.component.html',
  styleUrls: ['./omni-block-chain-agreement-sign-page.component.scss']
})
export class OmniBlockChainAgreementSignPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_OMNI_BLOCK_CHAIN;

  localTime: any;
  TIME_DIFF_FORMAT: string = 'DD/MM/YYYY';

  transaction: Transaction;
  signedSignatureSubscription: Subscription;
  signedOpen: Subscription;

  openSignedCommand: any;

  translationSubscribe: Subscription;

  commandSigned: any;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeService,
    private tokenService: TokenService,
    private alertService: AlertService
  ) {
    this.transaction = this.transactionService.load();
    this.signedSignatureSubscription = this.aisNativeService.getSigned().subscribe((signature: string) => {
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
    // if (!this.transaction.data.customer.imageSignature) {
    //   this.onSigned();
    // }
  }

  onBack(): void {
    this.router.navigate([ROUTE_OMNI_BLOCK_CHAIN_LOW_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_OMNI_BLOCK_CHAIN_FACE_CAPTURE_PAGE]);
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
    this.signedOpen = this.aisNativeService.openSigned().subscribe();
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
