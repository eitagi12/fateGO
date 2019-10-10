import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SimSerial, HomeService, AlertService, PageLoadingService, ShoppingCart, SimSerialComponent, AisNativeService } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN } from 'src/app/device-order/constants/wizard.constant';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { ShoppingCartService } from 'src/app/device-order/services/shopping-cart.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import {
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE,
  ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE
} from '../../constants/route-path.constant';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-register-mnp-verify-instant-sim-page',
  templateUrl: './new-register-mnp-verify-instant-sim-page.component.html',
  styleUrls: ['./new-register-mnp-verify-instant-sim-page.component.scss']
})
export class NewRegisterMnpVerifyInstantSimPageComponent implements OnInit, OnDestroy, AfterViewInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_AIS_DEVICE_SHARE_PLAN;
  serialForm: FormGroup;
  transaction: Transaction;
  simSerial: SimSerial;
  simSerialValid: boolean;
  shoppingCart: ShoppingCart;
  translationSubscribe: Subscription;
  keyinSimSerial: boolean;
  isHandsetDiscount: boolean;
  isEasyApp: boolean;

  @ViewChild('mcSimSerial')
  mcSimSerial: SimSerialComponent;
  serial: any;

  @ViewChild('serial')
  serialField: ElementRef;

  constructor(private router: Router,
    private homeService: HomeService,
    private transactionService: TransactionService,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService,
    private http: HttpClient,
    private shoppingCartService: ShoppingCartService,
    private translationService: TranslateService,
    private fb: FormBuilder,
    private aisNativeService: AisNativeService) {
    this.transaction = this.transactionService.load();
  }

  ngOnInit(): void {
    this.createForm();
    delete this.transaction.data.simCard;
    this.shoppingCart = Object.assign(this.shoppingCartService.getShoppingCartData(), {
      mobileNo: ''
    });
  }

  private createForm(): void {
    this.serialForm = this.fb.group({
      serial: ['', [Validators.required, Validators.pattern(/\d{13}/)]]
    });
  }

  public checkSimSerial(): void {
    this.keyinSimSerial = true;
    const serial = this.serialForm.controls['serial'].value;
    this.getMobileNoBySim(serial);
  }

  private getMobileNoBySim(serial: any): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/validate-verify-instant-sim?serialNo=${serial}`).toPromise()
      .then((resp: any) => {
        const simSerial = resp.data || [];
        this.simSerialValid = true;
        this.onSubmit();
        this.simSerial = {
          mobileNo: simSerial.mobileNo,
          simSerial: serial
        };
        this.transaction.data.simCard = {
          mobileNo: this.simSerial.mobileNo,
          simSerial: this.simSerial.simSerial,
          persoSim: false
        };
        this.pageLoadingService.closeLoading();
      }).catch((resp: any) => {
        this.simSerialValid = false;
        this.simSerial = undefined;
        const error = resp.error || [];
        this.pageLoadingService.closeLoading();
        this.alertService.notify({
          type: 'error',
          html: this.translationService.instant(error.resultDescription.replace(/<br>/, ' '))
        });
        this.onSubmit();
      });
  }
  private onSubmit(): void {
    this.serialForm.patchValue({
      serial: ''
    });
    this.serialField.nativeElement.focus();
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
      console.log('this.simSerial |>', this.simSerial);

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
      this.simSerialValid = false;
      this.simSerial = undefined;
      const error = resp.error || [];
      this.pageLoadingService.closeLoading();
      this.alertService.notify({
        type: 'error',
        html: this.translationService.instant(error.resultDescription.replace(/<br>/, ' '))
      });
    });
  }

  onOpenScanBarcode(): void {
    this.aisNativeService.scanBarcode();
    this.keyinSimSerial = false;
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_NUMBER_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_SHARE_PLAN_NEW_REGISTER_MNP_SELECT_PACKAGE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  ngAfterViewInit(): void {
    this.serialField.nativeElement.focus();
  }

  ngOnDestroy(): void {
    if (this.translationSubscribe) {
      this.translationSubscribe.unsubscribe();
    }
    this.transactionService.update(this.transaction);
  }

}
