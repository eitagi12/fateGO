import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE, ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE } from 'src/app/vas-package/constants/route-path.constant';
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

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
    this.mobileNo = this.transaction.data.simCard.mobileNo;
   }

  ngOnInit(): void {
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onMainMenu(): void {
    if (window.aisNative) {
      window.aisNative.onAppBack();
    } else {
      window.webkit.messageHandlers.onAppBack.postMessage('');
    }
  }

  onTopUp(): void {
    window.location.href = `/easy-app/top-up-vas?mobileNo=${this.mobileNo}`;
  }

  onSelectPackage(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_MENU_VAS_ROM_PAGE], { queryParams: this.mobileNo });
  }
}
