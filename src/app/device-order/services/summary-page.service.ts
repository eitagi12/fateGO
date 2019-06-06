import { Injectable } from '@angular/core';
import { Payment } from 'src/app/shared/models/transaction.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SummaryPageService {

  constructor(
    private translateService: TranslateService
  ) { }

  detailPayment(payment: Payment, trade: any = {}): string {
    if (payment && payment.paymentForm === `FULL`) {
      return this.descriptionPayment(payment);

    } else if (payment && payment.paymentForm === `INSTALLMENT`) {
      const paymentMethod = payment.paymentMethod || {};
      const advancePay = trade.advancePay || {};

      const price = (((+trade.promotionPrice || 0)
      + (advancePay.installmentFlag === `Y` ? +advancePay.amount : 0))
      / (+paymentMethod.month || 1));

      return `${this.translateService.instant(`บัตรเครดิต`)} ${paymentMethod.name} ${paymentMethod.percentage || 0} %
      \ ${paymentMethod.month || 0} ${this.translateService.instant(`เดือน`)}
      \ (${Math.ceil(price)} ${this.translateService.instant(`บาท`)}/${this.translateService.instant(`เดือน`)})`;

    }
  }

  descriptionPayment(payment: Payment): string {
    switch (payment && payment.paymentType) {
      case `QR_CODE`:
        if (payment.paymentQrCodeType === `LINE_QR`) {
          return `Rabbit Line Pay`;
        } else if (payment.paymentQrCodeType === `THAI_QR`) {
          return `Thai QR Promptpay`;
        }
        break;
      case `DEBIT`:
        return `${this.translateService.instant(`เงินสด`)}`;
      case `CREDIT`:
        return `${this.translateService.instant(`บัตรเครดิต`)}
        \ ${payment.paymentBank && payment.paymentBank.name}`;

      default:
        break;
    }
  }
}
