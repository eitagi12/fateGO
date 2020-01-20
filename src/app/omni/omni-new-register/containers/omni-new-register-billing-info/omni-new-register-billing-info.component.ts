import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { Router } from '@angular/router';
import { ROUTE_OMNI_NEW_REGISTER_EBILLING_ADDRESS_PAGE } from '../../constants/route-path.constant';
const Moment = moment;
export interface BillingInfo {
  billingAddress: BillingInfoOptions;
  billingCycle: BillingInfoOptions;
}

export interface BillingInfoOptions {
  text: string;
  isEdit?: boolean;
  isDelete?: boolean;
  onEdit?: Function;
  onDelete?: Function;
}

@Component({
  selector: 'app-omni-new-register-billing-info',
  templateUrl: './omni-new-register-billing-info.component.html',
  styleUrls: ['./omni-new-register-billing-info.component.scss']
})
export class OmniNewRegisterBillingInfoComponent implements OnInit {

  @Input() billingInfo: BillingInfo;
  @Input() view: boolean;
  mobileNoMember: string;
  transaction: Transaction;

  constructor(
    private translation: TranslateService,
    private transactionService: TransactionService,
    private router: Router,
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNoMember = this.transaction.data.simCard.mobileNoMember;
  }
  getBillCycleText(bill: string): any {
    const bills = bill.split(' ');
    if (this.translation.currentLang === 'TH') {
      return bill;
    } else {
      if (bills[3] === 'สิ้นเดือน') {
        return `From the ${Moment([0, 0, bills[1]]).format('Do')} to the end of every month`;
      } else {
        return `From the ${Moment([0, 0, bills[1]]).format('Do')} to the ${Moment([0, 0, bills[3]]).format('Do')} of every month`;
      }
    }
  }

  onEditAddress(): void {
    this.router.navigate([ROUTE_OMNI_NEW_REGISTER_EBILLING_ADDRESS_PAGE]);
  }

}
