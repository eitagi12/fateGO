import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, User, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { QRCodePaymentService, ImageBrannerQRCode } from 'src/app/shared/services/qrcode-payment.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-device-only-ais-qr-code-summary-page',
  templateUrl: './device-only-ais-qr-code-summary-page.component.html',
  styleUrls: ['./device-only-ais-qr-code-summary-page.component.scss']
})
export class DeviceOnlyAisQrCodeSummaryPageComponent implements OnInit {
  transaction: Transaction;
  priceOption: PriceOption;
  deposit: number;
  brannerImagePaymentQrCode: ImageBrannerQRCode;
  payment: Payment;
  price: any;
  phoneSMSForm: FormGroup;
  user: User;
  isLineShop: boolean = false;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService,
    private tokenService: TokenService
    ) {
      this.user = this.tokenService.getUser();
      this.transaction = this.transactionService.load();
      this.priceOption = this.priceOptionService.load();
      this.payment = this.transaction.data.payment;
      this.brannerImagePaymentQrCode = this.qrcodePaymentService.getBrannerImagePaymentQrCodeType(this.payment.paymentQrCodeType);
    }

    ngOnInit(): void {
      // tslint:disable-next-line:max-line-length
      this.price = this.priceOption.trade.priceType === 'NORMAL' ? this.priceOption.trade.normalPrice : this.priceOption.trade.promotionPrice;
      this.homeButtonService.initEventButtonHome();
      this.calculateSummary(this.deposit);
      if (this.user.locationCode === '63259' &&
        this.transaction.data.payment.paymentForm === 'FULL' &&
        this.transaction.data.payment.paymentOnlineCredit === true &&
        this.transaction.data.payment.paymentType === 'CREDIT') {
          this.isLineShop = true;
          this.createQueueForm();
      }
    }

    private calculateSummary(deposit: number): void {
      this.deposit = this.transaction.data.preBooking
      && this.transaction.data.preBooking.depositAmt ? -Math.abs(+this.transaction.data.preBooking.depositAmt) : 0;
    }

    summary(amount: number[]): number {
      return amount.reduce((prev, curr) => {
        return prev + curr;
      }, 0);
    }

    public createQueueForm(): void {
      this.phoneSMSForm = this.fb.group({
        phoneNo: (['', Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(/([0-9]{10})/)
        ])])
      });
      this.phoneSMSForm.valueChanges.subscribe((value) => {
        console.log(value);
        // this.queue = value.queue;
      });
    }

    onBack(): void {
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
    }

    onNext(): void {
      if (this.isLineShop) {
        if (this.phoneSMSForm.controls['phoneNo'].valid) {
          this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
        }
      } else {
        this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
      }
    }

    onHome(): void {
      this.homeService.goToHome();
    }

}
