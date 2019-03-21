import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-summary-product-and-service',
  templateUrl: './summary-product-and-service.component.html',
  styleUrls: ['./summary-product-and-service.component.scss']
})
export class SummaryProductAndServiceComponent implements OnInit {

  @ViewChild('detailTemplate')
  transaction: Transaction;
  detailTemplate: any;
  modalRef: BsModalRef;
  detail: string;

  constructor(
    private transactionService: TransactionService,
    private modalService: BsModalService
  ) {
    this.transaction = this.transactionService.load();
   }

  ngOnInit(): void {
  }

  onOpenDetail(detail: string): void {
    this.detail = detail;
    this.modalRef = this.modalService.show(this.detailTemplate);
  }

}
