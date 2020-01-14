import { Component, OnInit } from '@angular/core';
import { WIZARD_OMNI_NEW_REGISTER } from 'src/app/omni/constants/wizard.constant';
import { HomeService, PageLoadingService } from 'mychannel-shared-libs';
import { Transaction } from 'src/app/omni/omni-shared/models/transaction.model';
import { TransactionService } from 'src/app/omni/omni-shared/services/transaction.service';
import { CreateNewRegisterService } from 'src/app/omni/omni-shared/services/create-new-register.service';

@Component({
  selector: 'app-omni-new-register-result-page',
  templateUrl: './omni-new-register-result-page.component.html',
  styleUrls: ['./omni-new-register-result-page.component.scss']
})
export class OmniNewRegisterResultPageComponent implements OnInit {

  wizards: string[] = WIZARD_OMNI_NEW_REGISTER;
  transaction: Transaction;
  isSuccess: boolean;
  createTransactionService: Promise<any>;
  constructor(
    private homeService: HomeService,
    private transactionService: TransactionService,
    private createNewRegisterService: CreateNewRegisterService,
    private pageLoadingService: PageLoadingService
  ) {
    this.transaction = this.transactionService.load();
  }

  customer: any = {
    idCardNo: 'AA9900854',
    idCardType: 'บัตรประชาชน',
      firstName: 'Thanita',
      lastName: 'Anantaphaiboon',
      birthdate: '19/03/2535',
      gender: 'F',
      expireDate: '18/03/2567',
      nationality: 'Other',
      issuingCountry: 'ENG',
      caNumber: '1101500737451',
      mainMobile: '0855555555',
      billCycle: '13',
      homeNo: '12',
      moo: '1',
      room: '1',
      floor: '4',
      buildingName: 'A',
      soi: '-',
      street: '-',
      tumbol: 'บึง',
      amphur: 'ศรีราชา',
      province: 'ชลบุรี',
      zipCode: '20230',
      titleName: 'Ms.',
  };
  ngOnInit(): void {
    this.pageLoadingService.openLoading();
    this.createTransactionService = this.createNewRegisterService.createNewRegister(this.transaction)
      .then((resp: any) => {
        const data = resp.data || {};
        this.transaction.data.order = {
          orderNo: data.orderNo,
          orderDate: data.orderDate
        };
        this.transactionService.update(this.transaction);
        if (this.transaction.data.order.orderNo) {
          this.isSuccess = true;
        } else {
          this.isSuccess = false;
        }
        this.pageLoadingService.closeLoading();

      }).catch(() => {
        this.isSuccess = true;
        this.pageLoadingService.closeLoading();
      });
  }

  onMainMenu(): void {
    // bug gotohome จะ unlock เบอร์ ทำให้ออก orderไม่สำเร็จ
    window.location.href = '/smart-digital/main-menu';
    // this.homeService.goToHome();
  }
}
