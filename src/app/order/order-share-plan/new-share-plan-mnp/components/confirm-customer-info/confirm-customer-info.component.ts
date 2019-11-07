import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

export interface ConfirmCustomerInfo {
  titleName: string;
  firstName: string;
  lastName: string;
  idCardNo: string;
  mobileNo: string;
  mobileNoMember: string;
  mainPackage: string;
  mainPackageMember: string;
  onTopPackage?: string;
  packageDetail: string;
  packageDetailMember: string;
  idCardType?: string;
}

@Component({
  selector: 'app-confirm-customer-info',
  templateUrl: './confirm-customer-info.component.html',
  styleUrls: ['./confirm-customer-info.component.scss']
})
export class ConfirmCustomerInfoComponent implements OnInit {

  templatePopupPackageMaster: BsModalRef;
  templatePopupPackageMember: BsModalRef;
  @Input() confirmCustomerInfo: ConfirmCustomerInfo;

  constructor(
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
  }

  onShowPopUpPackageMaster(popUpPackageMaster: TemplateRef<any>): void {
    this.templatePopupPackageMaster = this.modalService.show(popUpPackageMaster);
  }

  onShowPopUpPackageMember(popUpPackageMember: TemplateRef<any>): void {
    this.templatePopupPackageMember = this.modalService.show(popUpPackageMember);
  }
}
