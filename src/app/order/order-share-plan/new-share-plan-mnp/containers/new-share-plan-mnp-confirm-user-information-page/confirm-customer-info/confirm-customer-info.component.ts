import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { ConfirmCustomerInfo } from 'mychannel-shared-libs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

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

  mobileMember: string = '0618269265';
  @Input()
  title: string;

  @Input()
  confirmCustomerInfo: ConfirmCustomerInfo;

  templatePopupRef: BsModalRef;

  constructor(
    private modalService: BsModalService
  ) {

   }

  ngOnInit(): void {
  }

  onShowPackagePopup(templatePopup: TemplateRef<any>): void {
    this.templatePopupRef = this.modalService.show(templatePopup);
  }
}
