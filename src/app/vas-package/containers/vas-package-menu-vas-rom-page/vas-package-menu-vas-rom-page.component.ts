import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction, TransactionType, TransactionAction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import * as moment from 'moment';
const Moment = moment;
@Component({
  selector: 'app-vas-package-menu-vas-rom-page',
  templateUrl: './vas-package-menu-vas-rom-page.component.html',
  styleUrls: ['./vas-package-menu-vas-rom-page.component.scss']
})
export class VasPackageMenuVasRomPageComponent implements OnInit, OnDestroy {
  vasPackageFrom: FormGroup;
  selected: any;
  transaction: Transaction;
  onSelectTransactionType: string;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void {
    this.vasPackageFrom = this.fb.group({
      'vasPackageRom': ['1'],
    });

  }

  onCompleted(transactionType: any): void {
    this.onSelectTransactionType = transactionType;
  }

  onBack(): void {
    // this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
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
        transactionType: this.onSelectTransactionType,
        action: TransactionAction.VAS_PACKAGE_ROM
      },
      transactionId: moment().format('YYYYMMDDHHmmss'),
    };
  }

}
