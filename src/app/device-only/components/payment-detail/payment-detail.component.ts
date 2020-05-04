import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { PriceOption } from 'src/app/shared/models/price-option.model';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class PaymentDetailComponent implements OnInit {

  @Output()
  completed: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  error: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  paymentDetail: any;

  @Input()
  installmentBanks: any;

  @Input()
  banks: any;

  public priceOption: PriceOption;
  paymentValue: any;
  isShowCreditOnline: boolean = true;
  isShowQrCode: boolean;
  paymentQrCodeType: any;
  isAWN: boolean;
  transaction: Transaction;
  payment: any;
  omiseInstallmentBanks: any[];
  bankOption: any[];
  installments: any[];
  bankSelected: any;
  isShowPercentAndTerm: boolean = false;
  defaultBankSelected: any;
  defaultPercentAndTermSelected: any;

  constructor(
    private transactionService: TransactionService,
    private priceOptionService: PriceOptionService,
    private http: HttpClient
  ) {
    this.transaction = this.transactionService.load();
    this.priceOption = this.priceOptionService.load();
  }

  ngOnInit(): void {
    this.setPaymentValue();
    if (this.paymentDetail && this.paymentDetail.isFullPayment) {
      this.checkQrCodeSelected();
      if (this.paymentDetail.omisePayment) {
        this.isAWN = true;
        this.setPaymentValueOnlineCredit();
      } else {
        this.isAWN = false;
        this.isShowQrCode = true;
        this.error.emit(false);
      }
    } else {
      this.mapBanks();
    }

    if (this.transaction && this.transaction.data && this.transaction.data.payment) {
      this.payment = this.transaction.data.payment;
      if (this.paymentDetail.isFullPayment) {
        this.defaultFullPaymentValue();
      } else {
        this.paymentValue = {
          payment: this.transaction.data.payment
        };
        this.isShowPercentAndTerm = true;
        this.defaultBankSelected = this.transaction.data.payment.paymentMethod.abb;
        this.completed.emit(this.paymentValue);
        this.error.emit(true);
      }
    }
  }

  checkQrCodeSelected(): void {
    const qrCode = document.getElementById('qr');
    const qrCodeSelected = qrCode.getElementsByClassName('qr-logo');
    for (let i = 0; i < qrCodeSelected.length; i++) {
      qrCodeSelected[i].addEventListener('click', function(): void {
        const current = document.getElementsByClassName('qr-logo active');
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' active', '');
        }
        this.className += ' active';
      });
    }
  }

  selectQrCode(value: any): void {
    this.paymentQrCodeType = value;
    this.setPaymentValueQrCode(this.paymentQrCodeType);
  }

  onPaymentTypeChange(value: any): void {
    if (value === 'omise') {
      this.setPaymentValueOnlineCredit();
      this.isShowCreditOnline = true;
      this.isShowQrCode = false;
    } else if (value === 'qrcode') {
      if (this.paymentQrCodeType) {
        this.setPaymentValueQrCode(this.paymentQrCodeType);
      } else {
        this.error.emit(false);
      }
      this.isShowCreditOnline = false;
      this.isShowQrCode = true;
    } else {
      this.setPaymentValueDebit();
      this.isShowCreditOnline = false;
      this.isShowQrCode = false;
    }
  }

  setPaymentValue(): void {
    this.paymentValue = {
      payment: {
        'paymentBank': '',
        'paymentForm': this.paymentDetail.isFullPayment ? 'FULL' : 'INSTALLMENT',
        'paymentMethod': '',
        'paymentOnlineCredit': true,
        'paymentQrCodeType': '',
        'paymentType': ''
      }
    };
  }

  setPaymentValueOnlineCredit(): void {
    this.paymentValue.payment.paymentOnlineCredit = true;
    this.paymentValue.payment.paymentQrCodeType = '';
    this.paymentValue.payment.paymentType = 'CREDIT';
    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

  setPaymentValueQrCode(value: any): void {
    this.paymentValue.payment.paymentOnlineCredit = false;
    this.paymentValue.payment.paymentQrCodeType = value;
    this.paymentValue.payment.paymentType = 'QR_CODE';
    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

  setPaymentValueDebit(): void {
    this.paymentValue.payment.paymentOnlineCredit = false;
    this.paymentValue.payment.paymentQrCodeType = '';
    this.paymentValue.payment.paymentType = 'DEBIT';
    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

  defaultFullPaymentValue(): void {
    if (this.payment) {
      if (this.payment.paymentType === 'QR_CODE') {
        this.paymentQrCodeType = this.payment.paymentType;
        this.setPaymentValueQrCode(this.payment.paymentQrCodeType);
        this.isShowCreditOnline = false;
        this.isShowQrCode = true;
        if (this.payment.paymentQrCodeType === 'LINE_QR') {
          document.getElementById('lineQr').className += ' active';
        } else if (this.payment.paymentQrCodeType === 'THAI_QR') {
          document.getElementById('thaiQr').className += ' active';
        }
      } else if (this.payment.paymentType === 'CREDIT') {
        this.setPaymentValueOnlineCredit();
        this.isShowCreditOnline = true;
        this.isShowQrCode = false;
      } else {
        this.setPaymentValueDebit();
        this.isShowCreditOnline = false;
        this.isShowQrCode = false;
      }
    }
  }

  defaultChecked(): string {
    if (this.payment) {
      return this.payment.paymentType;
    } else {
      const paymentType = this.isAWN ? 'CREDIT' : 'QR_CODE';
      return paymentType;
    }
  }

  mapBanks(): any {
    const trade = this.priceOption.trade;
    this.http.get(`/api/payments/get-bank-installment?price=${trade.promotionPrice}`).toPromise()
      .then((res: any) => {
        const data = res.data || [];
        this.installmentBanks = data;
      }).then(() => {
        const banks_mapDb = [];
        const result = (this.banks || []).filter((bank: any) => {
          this.installmentBanks.forEach((installment_bank: any) => {
            if (bank.abb === installment_bank.bankabb) {
              installment_bank.installment.forEach((_installment: any) => {
                const installment_str = _installment.percent + '% ' + _installment.month;
                if (bank.installment === installment_str) {
                  bank = {
                    ...bank,
                    issuerBank: installment_bank.bankomise
                  };
                  banks_mapDb.push(bank);
                  return bank;
                }
              });
            }
          });
        });
        this.omiseInstallmentBanks = banks_mapDb;
        this.bankOption = (this.omiseInstallmentBanks || []).reduce((prev, curr) => {
          const exists = prev.find(p => p.abb === curr.abb);
          if (!exists) {
            prev.push(curr);
          }
          return prev;
        }, []);

        if (this.transaction.data) {
          const bankAbb = this.transaction.data.payment.paymentMethod.abb;
          const bankInstallment = this.transaction.data.payment.paymentMethod.installment;
          this.onSelectBank(bankAbb);
          this.defaultPercentAndTermSelected = bankAbb + bankInstallment;
          this.error.emit(true);
        }
      });
  }

  onSelectBank(value: any): void {
    this.bankSelected = value;
    const installment = [];
    this.omiseInstallmentBanks.filter((bank: any) => {
      if (bank.abb === value) {
        installment.push(bank);
      }
    });
    this.installments = installment;
    this.isShowPercentAndTerm = true;
    this.defaultPercentAndTermSelected = '';
    this.error.emit(false);
  }

  onInstallmentChange(value: any): void {
    let bankIsSelect: any;
    bankIsSelect = this.omiseInstallmentBanks.find((bank: any) => {
      if (bank.abb === this.bankSelected && bank.installment === value) {
        return bank;
      }
    });

    this.paymentValue = {
      payment: {
        'paymentBank': bankIsSelect,
        'paymentForm': this.paymentDetail.isFullPayment ? 'FULL' : 'INSTALLMENT',
        'paymentMethod': bankIsSelect,
        'paymentOnlineCredit': true,
        'paymentQrCodeType': '',
        'paymentType': 'CREDIT'
      }
    };

    this.completed.emit(this.paymentValue);
    this.error.emit(true);
  }

}
