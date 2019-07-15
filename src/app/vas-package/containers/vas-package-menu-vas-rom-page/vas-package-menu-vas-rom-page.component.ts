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
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
  ) { }

  ngOnInit(): void {
    this.createTransaction();
    this.createForm();
  }
  createForm(): void {
    this.vasPackageFrom = this.fb.group({
      'vasPackageRom': ['1'],
    });

  }

  onBack(): void {
    // this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    console.log('this.vasPackageFrom.controls.vasPackageRom.value', this.vasPackageFrom.controls.vasPackageRom.value);
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
        transactionType: TransactionType.VAS_PACKAGE_ROM,
        action: TransactionAction.KEY_IN,
      },
      transactionId: moment().format('YYYYMMDDHHmmss'),
    };
  }

}
