import { Pipe, PipeTransform } from '@angular/core';
import { PriceOptionUtils } from 'src/app/shared/utils/price-option-utils';

@Pipe({
  name: 'privilegeToTradeSlider'
})
export class PrivilegeToTradeSliderPipe implements PipeTransform {

  transform(privilege: any, args?: any): any {
    if (!privilege) {
      return [];
    }

    return (privilege.trades || []).map((trade: any) => {

      const advancePay = trade.advancePay || {};
      const discount = trade.discount || {};
      const installmentFlag = advancePay.installmentFlag === 'Y' && +advancePay.amount > 0;
      const payment = (trade.payments || []).find(p => p.method !== 'PP') || {};
      const installments = PriceOptionUtils.getInstallmentsFromTrades(
        privilege.trades
      );
      const isRemark = !!(trade.banks || []).find(bank => bank.remark !== '' && bank.remark !== null && bank.remark);

      const slider: any = {
        freeGoods: (trade.freeGoods || []).map(freeGood => freeGood.name),
        installmentType: 'wallet', // 'bath',
        specialType: discount.specialType,
        specialAmount: +advancePay.amount,
        value: trade
      };
      switch (payment.method) {
        case 'CC':
          if (installments) {
            slider.isCashBack = isRemark;
            slider.description = 'ผ่อนชำระค่าเครื่อง';
            // ใช้คะแนนบัตรเครดิต
            slider.paymentPoint = !!(trade.payments || []).find(p => p.method === 'PP');
            slider.installments = installments;
            if (installmentFlag) {
              slider.description += 'และแพ็กเกจค่าบริการล่วงหน้า';
            }
          } else {
            slider.description = 'ชำระเต็มจำนวน';
          }
          break;
        case 'CA':
        case 'CA/CC':
        default:
          slider.description = 'ชำระเต็มจำนวน';
      }
      return slider;
    });
  }

  isAdvancePay(trade: any): boolean {
    const advancePay = trade.advancePay || {};
    return (trade.banks
      && this.isPayment(trade)
      && advancePay.installmentFlag === 'Y');
  }

  isPayment(trade: any): boolean {
    return (trade.payments || []).find(payment =>
      payment.method === 'CA' || payment.method === 'CC/CA'
    );
  }
}
