import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
const Moment = moment;
export interface BillingInfo {
  billingMethod: BillingInfoOptions;
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
  selector: 'app-billing-info',
  templateUrl: './billing-info.component.html',
  styleUrls: ['./billing-info.component.scss']
})
export class BillingInfoComponent implements OnInit {

  @Input()
  billingInfo: BillingInfo;

  @Input()
  view: boolean;

  // mock รอ เบอร์ลูก
  mobileMember: string = '0618269265';

  constructor(
    private translation: TranslateService
  ) { }

  ngOnInit(): void {
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

}
