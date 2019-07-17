import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
const Moment = moment;
declare let window: any;
@Component({
  selector: 'app-vas-package-menu-vas-rom-page',
  templateUrl: './vas-package-menu-vas-rom-page.component.html',
  styleUrls: ['./vas-package-menu-vas-rom-page.component.scss']
})
export class VasPackageMenuVasRomPageComponent implements OnInit, OnDestroy {
  vasPackageFrom: FormGroup;
  selected: any;
  transaction: Transaction;
  onSelectTransactionType: any;
  params: Params;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private aisNativeService: AisNativeOrderService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.params = params;
  });
  }

  createForm(): void {
    this.vasPackageFrom = this.fb.group({
      'vasPackageRom': ['1'],
    });
    this.onSelectTransactionType = 'RomAgent';
  }

  onCompleted(transactionType: any): void {
    this.onSelectTransactionType = transactionType;
  }

  onBack(): void {
    if (window.aisNative) {
      window.aisNative.onAppBack();
    } else {
      window.webkit.messageHandlers.onAppBack.postMessage('');
    }
  }

  onNext(): void {
    this.createTransaction();
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
  }

  private createTransaction(): void {
    this.transaction = {
      data: {
        transactionType: this.onSelectTransactionType === 'Customer' ?
          TransactionType.VAS_PACKAGE_CUSTOMER : TransactionType.VAS_PACKAGE_ROM,
        action: TransactionAction.VAS_PACKAGE_ROM,
        simCard: {
          mobileNo: this.params ? this.params.mobileNo : ''
        }
      },
      transactionId: moment().format('YYYYMMDDHHmmss'),
    };
  }

}
