import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService, REGEX_MOBILE} from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_RESULT_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Component({
  selector: 'app-vas-package-current-balance-page',
  templateUrl: './vas-package-current-balance-page.component.html',
  styleUrls: ['./vas-package-current-balance-page.component.scss']
})
export class VasPackageCurrentBalancePageComponent implements OnInit {

  romAgentForm: FormGroup;
  transaction: Transaction;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private homeService: HomeService,
    private transactionService: TransactionService,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.romAgentForm = this.fb.group({
      'mobileNo': [{value: '', disabled: true}, Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
      'amount': [{value: '', disabled: true}, Validators.compose([Validators.required])],
    });
  }

  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_RESULT_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
