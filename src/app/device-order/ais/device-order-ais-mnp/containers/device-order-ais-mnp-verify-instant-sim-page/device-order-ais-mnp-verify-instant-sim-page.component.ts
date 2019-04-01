import { Component, OnInit, OnDestroy } from '@angular/core';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { SimSerial, HomeService, AlertService, PageLoadingService, ShoppingCart } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_NUMBER_PAGE, ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-device-order-ais-mnp-verify-instant-sim-page',
  templateUrl: './device-order-ais-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./device-order-ais-mnp-verify-instant-sim-page.component.scss']
})
export class DeviceOrderAisMnpVerifyInstantSimPageComponent implements OnInit, OnDestroy {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;
  shoppingCart: ShoppingCart;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private shoppingCartService: ShoppingCartService,
    private http: HttpClient,
    private translation: TranslateService
  ) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    delete this.transaction.data.simCard;

    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
  }

  onCheckSimSerial(serial: string): void {
    let validateVerifyInstantSim;
    if (environment.name === 'LOCAL' && serial === '9999999999999') {
      validateVerifyInstantSim = Promise.resolve({
        data: {
          mobileNo: '0999999999'
        }
      });
    } else {
      validateVerifyInstantSim = this.http.get(`/api/customerportal/validate-verify-instant-sim?serialNo=${serial}`).toPromise();
    }

    this.pageLoadingService.openLoading();
    validateVerifyInstantSim.then((resp: any) => {
      const simSerial = resp.data || {};
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

      if (simSerial.mobileStatus === 'Registered') {
        this.simSerialValid = false;
        const noStatus = this.translation.instant('หมายเลข');
        this.alertService.error(noStatus + serial + this.translation.instant('มีผู้ใช้งานแล้ว กรุณาเลือกหมายเลขใหม่'));
        return;
      } else if (simSerial.mobileStatus !== 'Registered' && simSerial.mobileStatus !== 'Reserved') {
        this.simSerialValid = false;
        const noStatus = this.translation.instant('หมายเลข');
        this.alertService.error(noStatus + serial + this.translation.instant('ไม่พร้อมทำรายการ กรุณาเลือกหมายเลขใหม่'));
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
      this.shoppingCart = Object.assign(this.shoppingCart, {
        mobileNo: simSerial.mobileNo
      });
      this.pageLoadingService.closeLoading();
    }).catch((resp: any) => {
      const error = resp.error || [];
      this.pageLoadingService.closeLoading();
      this.alertService.error(error.resultDescription);
    });

  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_MNP_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {
    this.transactionService.update(this.transaction);
  }
}
