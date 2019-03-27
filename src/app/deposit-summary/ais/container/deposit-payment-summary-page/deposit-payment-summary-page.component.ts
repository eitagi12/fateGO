import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { PageLoadingService, AlertService, TokenService, Utils } from 'mychannel-shared-libs';
import { Seller, Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Router } from '@angular/router';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { HttpClient } from '@angular/common/http';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { DEPOSIT_PAYMENT_SUMMARY_PAGE, DEPOSIT_QUEUE_PAGE, DEPOSIT_PAYMENT_PAGE } from 'src/app/deposit-summary/constants/route-path.constant';
import { WIZARD_RESERVE_WITH_DEPOSIT } from 'src/app/deposit-summary/constants/wizard.constant';
import { LocalStorageService } from 'ngx-store';
import { CreateDeviceOrderService } from 'src/app/deposit-summary/services/create-device-order.service';

@Component({
  selector: 'app-deposit-payment-summary-page',
  templateUrl: './deposit-payment-summary-page.component.html',
  styleUrls: ['./deposit-payment-summary-page.component.scss']
})
export class DepositPaymentSummaryPageComponent implements OnInit, OnDestroy {

  public channelType: string;
  wizards: any = WIZARD_RESERVE_WITH_DEPOSIT;

  transaction: Transaction;
  priceOption: PriceOption;

  @ViewChild('detailTemplate')
  detailTemplate: any;
  detail: string;

  customerAddress: string;
  deposit: number;
  sellerCode: string;
  checkSellerForm: FormGroup;
  seller: Seller = {};

  constructor(
    private router: Router,
    private pageLoadingService: PageLoadingService,
    private transactionService: TransactionService,
    private localStorageService: LocalStorageService,
    private createDeviceOrderService: CreateDeviceOrderService,
    private tokenService: TokenService,
    private http: HttpClient,
    private priceOptionService: PriceOptionService,
    public fb: FormBuilder,
    private alertService: AlertService,
    private utils: Utils
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }
  ngOnInit(): void {
    const user = this.tokenService.getUser();
    this.http.get(`/api/salesportal/location-by-code?code=${user.locationCode}`).toPromise().then((response: any) => {
      this.seller = {
        sellerName: user.firstname && user.lastname ? `${user.firstname} ${user.lastname}` : user.username,
        locationName: response.data.displayName,
        locationCode: user.locationCode,
        sellerNo: user.ascCode
      };
    });
    this.http.get(`/api/customerportal/newRegister/getEmployeeDetail/username/${user.username}`).toPromise().then((response: any) => {
      this.seller.sellerNo = response.data.pin;
    });
    this.createForm();
  }

  createForm(): void {
    this.checkSellerForm = this.fb.group({
      checkSeller: ['', Validators.compose([Validators.required, Validators.pattern(/^[0-9]+$/)])]
    });

    this.checkSellerForm.valueChanges.subscribe((value) => {
      if (value.checkSeller) {
        this.sellerCode = value.checkSeller;
      }
    });
  }
  onCancel(): void {
    const backUrl = '';
    this.router.navigate([backUrl]);
  }

  isUserASPType(): boolean {
    return this.tokenService.getUser().userType === 'ASP';
  }

  onBack(): void {
    this.router.navigate([DEPOSIT_PAYMENT_PAGE]);
  }
  onNext(): void {
    this.pageLoadingService.openLoading();
    this.http.get(`/api/customerportal/checkSeller/${this.seller.sellerNo}`).toPromise()
    .then((shopCheckSeller: any) => {
      if (shopCheckSeller.data.condition) {
        this.transaction.data.seller = {
          ...this.seller,
          employeeId: shopCheckSeller.data.isAscCode
        };
        this.pageLoadingService.closeLoading();
        this.router.navigate([DEPOSIT_QUEUE_PAGE]);
        } else {
          this.alertService.error(shopCheckSeller.data.message.replace('<br/> ', ' '));
        }
      }).catch((error: any) => {
        this.pageLoadingService.closeLoading();
        this.alertService.error('ระบบไม่สามารถแสดงข้อมูลได้ในขณะนี้');
      });
  }
  onHome(): void {
    this.alertRemoveAddCart('/');
  }
  alertRemoveAddCart(url: string): void {
    this.alertService.notify({
      type: 'question',
      showConfirmButton: true,
      confirmButtonText: 'CONFIRM',
      cancelButtonText: 'CANCEL',
      showCancelButton: true,
      reverseButtons: true,
      allowEscapeKey: false,
      html: 'ต้องการยกเลิกรายการขายหรือไม่ <br> การยกเลิก ระบบจะคืนสินค้าเข้าสต๊อคสาขาทันที'
    }).then((data) => {
        if (data.value) {
          const userId = this.tokenService.getUser().username;
          const soId = this.localStorageService.load('reserveSoId').value;
          this.createDeviceOrderService.removeAddCart(soId, userId).then( (res) => {
            window.location.href = url;
          });
        }
    });
  }
  summary(amount: number[]): number {
    return amount.reduce((prev, curr) => {
      return prev + curr;
    }, 0);
  }
  ngOnDestroy(): void {
    this.transactionService.save(this.transaction);
    this.priceOptionService.save(this.priceOption);
  }
}
