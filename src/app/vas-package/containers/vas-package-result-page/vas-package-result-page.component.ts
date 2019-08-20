import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';

declare let window: any;
@Component({
  selector: 'app-vas-package-result-page',
  templateUrl: './vas-package-result-page.component.html',
  styleUrls: ['./vas-package-result-page.component.scss']
})
export class VasPackageResultPageComponent implements OnInit {

  public transaction: Transaction;
  public mobileNo: any;
  public isRomAgent: boolean;
  constructor(
    private router: Router,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.mobileNo = this.transaction.data.simCard.mobileNo;
  }

  ngOnInit(): void {
  }

  public checkTransactionType(): any {
    if (this.transaction.data.transactionType === 'RomAgent') {
      return true;
    } else {
      return false;
    }
  }

  onMainMenu(): void {
    if (window.aisNative) {
      window.aisNative.onAppBack();
    } else {
      window.webkit.messageHandlers.onAppBack.postMessage('');
    }
  }

  onTopUp(): void {
    window.location.href = `/easy-app/top-up?mobileNo=${this.mobileNo}`;
  }

  onSelectPackage(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE], { queryParams: this.mobileNo });
  }
}
