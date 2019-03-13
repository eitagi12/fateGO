import { Component, OnInit, OnDestroy } from '@angular/core';
import { SimSerial, HomeService, AlertService, PageLoadingService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import {
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE,
  ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE
} from 'src/app/device-order/ais/device-order-ais-new-register/constants/route-path.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';

@Component({
  selector: 'app-device-order-ais-new-register-verify-instant-sim-page',
  templateUrl: './device-order-ais-new-register-verify-instant-sim-page.component.html',
  styleUrls: ['./device-order-ais-new-register-verify-instant-sim-page.component.scss']
})
export class DeviceOrderAisNewRegisterVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    delete this.transaction.data.simCard;
  }

  onCheckSimSerial(serial: string): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/newRegister/${serial}/queryMobileBySim`).toPromise()
      .then((resp: any) => {
        const simSerial = resp.data || [];

        if (simSerial.mobileStatus === 'Registered') {
          this.simSerialValid = false;
          this.alertService.error(`หมายเลข ${serial} มีผู้ใช้งานแล้ว กรุณาเลือกหมายเลขใหม่`);
          return;
        } else if (simSerial.mobileStatus !== 'Registered' && simSerial.mobileStatus !== 'Reserved') {
          this.simSerialValid = false;
          this.alertService.error(`สถานะหมายเลข ${serial} ไม่พร้อมทำรายการ กรุณาเลือกหมายเลขใหม่`);
          return;
        }
        this.simSerialValid = true;
        this.simSerial = {
          mobileNo: simSerial.mobileNo,
          simSerial: serial
        };
        this.transaction.data.simCard = {
          mobileNo: this.simSerial.mobileNo,
          simSerial: this.simSerial.simSerial,
          persoSim: false
        };
      })
      .then(() => {
        this.pageLoadingService.closeLoading();
      });
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_NEW_REGISTER_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
