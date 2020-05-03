import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE, ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE, ROUTE_DEVICE_ONLY_AIS_OMISE_GENERATE_PAGE } from '../../constants/route-path.constant';
import { Router } from '@angular/router';
import { HomeService, AlertService, User, TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction, Payment } from 'src/app/shared/models/transaction.model';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';
import { QRCodePaymentService, ImageBrannerQRCode } from 'src/app/shared/services/qrcode-payment.service';
import { HomeButtonService } from 'src/app/device-only/services/home-button.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QrCodeOmiseService } from 'src/app/device-only/services/qr-code-omise.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  feedback: string = '*กรุณาระบุเบอร์มือถือ';
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private homeButtonService: HomeButtonService,
    private priceOptionService: PriceOptionService,
    private qrcodePaymentService: QRCodePaymentService,
    private qrCodeOmiseService: QrCodeOmiseService,
    private tokenService: TokenService,
    private http: HttpClient,
    private pageLoadingService: PageLoadingService,
    private alertService: AlertService
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
  }

  onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_CHECKOUT_PAYMENT_QR_CODE_PAGE]);
  }

  onNext(): void {
    this.pageLoadingService.openLoading();
    if (this.isLineShop) {
      if (this.phoneSMSForm.controls['phoneNo'].valid) {
        const phoneNo = this.phoneSMSForm.controls['phoneNo'].value;
        // const msisdn = `66${phoneNo.substring(1, phoneNo.length)}`;
        if (this.transaction.data.payment.paymentForm === 'FULL') {
          const params = this.createDataGenerateQR();
          this.qrCodeOmiseService.createOrder(params).then((res: any) => {
            const data = res && res.data;
            this.transaction.data.omise = {
              ...this.transaction.data.omise,
              qrCodeStr: data.redirectUrl,
              orderId: data.orderId
            };
            this.transactionService.update(this.transaction);
            const paymentUrl = this.transaction.data.omise.qrCodeStr;
            this.generateShortLink(paymentUrl, phoneNo);
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ONLY_AIS_OMISE_GENERATE_PAGE]);
          }).catch((err) => {
            this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
          });
        } else {
          const params = this.createDataInstallment();
          this.qrCodeOmiseService.createOrderInstallment(params).then((res: any) => {
            const data = res && res.data;
            this.transaction.data.omise = {
              ...this.transaction.data.omise,
              qrCodeStr: data.endpointUrl,
              orderId: data.orderId,
              saleId: data.saleId
            };
            this.transactionService.update(this.transaction);
            this.sendSMSUrl({ mobileNo: phoneNo, urlPayment: data.endpointUrl});
            this.pageLoadingService.closeLoading();
            this.router.navigate([ROUTE_DEVICE_ONLY_AIS_OMISE_GENERATE_PAGE]);
          }).catch((err) => {
            this.alertService.error('ระบบไม่สามารถทำรายการได้ขณะนี้ กรุณาทำรายการอีกครั้ง');
          });
        }
        // const phoneNo = this.phoneSMSForm.controls['phoneNo'].value;
        // const msisdn = `66${phoneNo.substring(1, phoneNo.length)}`;
      }
    } else {
      this.router.navigate([ROUTE_DEVICE_ONLY_AIS_QR_CODE_GENERATE_PAGE]);
    }
  }

  generateShortLink(url: string, mobileNo: string): Promise<any> {
    let urlLink: string = url;
    if (environment.ENABLE_SHORT_LINK) {
      const splitUrl: any = url.split('?');
      urlLink = `${environment.PREFIX_SHORT_LINK}?${splitUrl[1]}`;
      this.transaction.data.omise.shortUrl = urlLink;
      this.transactionService.update(this.transaction);
    }
    return this.sendSMSUrl({ mobileNo: mobileNo, urlPayment: urlLink }).then(() => {
    });
  }

  sendSMSUrl(params: any): Promise<any> {
    const requestBody: any = {
      recipient: {
        recipientIdType: '0',
        recipientIdData: (params.mobileNo).replace(/^0+/, '66')
      },
      content: `สำหรับการชำระเงินค่าสินค้าผ่านบัตรเครดิตออนไลน์ คลิก ${params.urlPayment}`,
      sender: 'AIS'
    };
    return this.http.post('/api/customerportal/newregister/send-sms', requestBody).toPromise()
      .then(() => {
      });
  }

  createDataGenerateQR(): any {
    const shippingInfo = this.transaction.data.shippingInfo;
    const customer = shippingInfo.firstName + ' ' + shippingInfo.lastName;
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const phoneNo = this.phoneSMSForm.controls['phoneNo'].value;
    const color = productStock.colorName || productStock.color;
    return {
      companyCode: productStock.company,
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: this.user.locationCode,
      locationName: this.transaction.data.seller.locationName,
      mobileNo: phoneNo,
      customer: customer,
      orderList: [
        {
          name: productDetail.name + 'สี' + color,
          price: trade.promotionPrice
        }
      ]
    };
  }

  createDataInstallment(): any {
    const shippingInfo = this.transaction.data.shippingInfo;
    const customer = shippingInfo.firstName + ' ' + shippingInfo.lastName;
    const productStock = this.priceOption.productStock;
    const productDetail = this.priceOption.productDetail;
    const trade = this.priceOption.trade;
    const phoneNo = this.phoneSMSForm.controls['phoneNo'].value;
    const color = productStock.colorName || productStock.color;
    const installmentTerm: any = this.transaction.data.payment.paymentMethod.installment.split('%');
    return {
      orderDesc: productDetail.name + 'สี' + color,
      amount: trade.promotionPrice,
      currency: 'THB',
      paymentMethod: '13',
      installmentInfo: {
        issuerBank: this.transaction.data.payment.paymentMethod.issuerBank,
        installmentTerm: +installmentTerm[1].trim()
      },
      soId: this.transaction.data.order.soId,
      companyCode: productStock.company,
      companyName: 'บริษัท แอดวานซ์ ไวร์เลส เน็ทเวอร์ค จำกัด',
      locationCode: this.user.locationCode,
      locationName: this.transaction.data.seller.locationName,
      mobileNo: phoneNo,
      customer: customer
    };
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  checkEnabled(): boolean {
    if (this.isLineShop && this.phoneSMSForm.controls['phoneNo'].invalid) {
      return true;
    } else {
      return false;
    }
  }

}
