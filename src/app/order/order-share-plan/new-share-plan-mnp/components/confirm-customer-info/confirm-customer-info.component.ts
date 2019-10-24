import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ConfirmCustomerInfo } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

export interface ConfirmCustomerInfo {
  titleName: string;
  firstName: string;
  lastName: string;
  idCardNo: string;
  mobileNo: string;
  mainPackage: string;
  onTopPackage?: string;
  packageDetail: string;
  idCardType?: string;
}

@Component({
  selector: 'app-confirm-customer-info',
  templateUrl: './confirm-customer-info.component.html',
  styleUrls: ['./confirm-customer-info.component.scss']
})
export class ConfirmCustomerInfoComponent implements OnInit {

  mobileNoMember: string;
  packageMember: string = 'รอเก็บ package จากหน้าPackMember ลง Transaction ';
  @Input()
  title: string;

  @Input()
  confirmCustomerInfo: ConfirmCustomerInfo;

  templatePopupRef: BsModalRef;
  transaction: Transaction;

  constructor(
    private modalService: BsModalService,
    private transactionService: TransactionService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.mobileNoMember = this.transaction.data.simCard.mobileNoMember;
  }

  onShowPackagePopup(templatePopup: TemplateRef<any>): void {
    this.templatePopupRef = this.modalService.show(templatePopup);
  }
}
