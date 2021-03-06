import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService, TokenService, PageLoadingService, REGEX_MOBILE, AlertService, Utils } from 'mychannel-shared-libs';
import { Router } from '@angular/router';
import { ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE } from 'src/app/rom-transaction/constants/route-path.constant';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AisNativeOrderService } from 'src/app/shared/services/ais-native-order.service';
import { Subscription, Observable } from 'rxjs';
declare let window: any;

@Component({
  selector: 'app-rom-transaction-list-mobile-page',
  templateUrl: './rom-transaction-list-mobile-page.component.html',
  styleUrls: ['./rom-transaction-list-mobile-page.component.scss']
})
export class RomTransactionListMobilePageComponent implements OnInit, OnDestroy {

  username: any;
  transaction: Transaction;
  romData: any = [];
  currenDate: string = '';
  mobileForm: FormGroup;
  queryRomTransaction: Promise<any>;
  param: any;
  usernameSubscript: Subscription;

  constructor(
    public router: Router,
    private homeService: HomeService,
    public tokenService: TokenService,
    private pageLoadingService: PageLoadingService,
    private http: HttpClient,
    private alertService: AlertService,
    private transactionService: TransactionService,
    private fb: FormBuilder,
    private utils: Utils,
    private aisNativeOrderService: AisNativeOrderService,
  ) {
  }

  ngOnInit(): void {
    this.createForm();
    this.currenDate = this.getCurrentDate();
    this.aisNativeOrderService.getNativeUsername();
    this.usernameSubscript = this.aisNativeOrderService.getUsername().subscribe((response: any) => {
      this.username = response.username;
      this.queryRomList();
    });
  }

  createForm(): void {
    this.mobileForm = this.fb.group({
      'mobileNo': ['', Validators.compose([Validators.required, Validators.pattern(REGEX_MOBILE)])],
    });
  }

  queryRomList(mobile?: string): void {
    if (!this.username) {
      this.alertService.error('ไม่พบชื่อผู้ใช้งาน กรุณา Login ใหม่อีกครั้ง');
      return;
    }
    this.pageLoadingService.openLoading();

    this.param = {
      username: this.username,
      cusMobileNo: mobile
    };
    this.queryRomTransaction = this.http.post('/api/customerportal/query-rom-transaction', {
      username: this.username,
      cusMobileNo: mobile
    }).toPromise()
      .then((res: any) => {
        const data = res.data || [];
        this.pageLoadingService.closeLoading();
        return this.romData = data.map((roms: any) => {
          const createMoment = moment(roms.createDate);
          roms.time = createMoment.format('HH.mm');
          return roms;
        })
          .sort((val1, val2) => val2.time - val1.time);
      })
      .then(() => {
        this.createTransaction(this.romData);
      })
      .catch((err) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error(err);
      });
  }

  getCurrentDate(): string {
    const day = moment().format('DD');
    const mount = moment().format('M');
    const year = moment().format('YYYY');
    const monthList = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    return day + ' ' + monthList[+mount - 1] + ' ' + (+year + 543);
  }

  createTransaction(romData: any): void {
    this.transaction = {
      data: {
        transactionType: null,
        action: null,
        romTransaction: {
          username: this.username,
          romData: romData,
          romTransaction: null
        }
      }
    };
  }

  onSelect(rom: any): void {
    this.transaction.data.romTransaction.romTransaction = rom;
  }

  onSearch(): void {
    const mobile = this.mobileForm.controls.mobileNo.value;
    this.transaction.data.romTransaction = null;
    this.queryRomList(mobile);
    this.mobileForm.patchValue({
      mobileNo: ''
    });
  }

  onNext(): void {
    this.router.navigate([ROUTE_ROM_TRANSACTION_SHOW_INFORMATION_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  onBack(): void {
    if (window.aisNative) {
      window.aisNative.onAppBack();
    } else {
      window.webkit.messageHandlers.onAppBack.postMessage('');
    }
  }

  ngOnDestroy(): void {
    this.usernameSubscript.unsubscribe();
    this.transactionService.save(this.transaction);
  }

}
