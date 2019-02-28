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

      let description = trade.payments ? 'ชำระเต็มจำนวน' : 'ผ่อนชำระค่าเครื่อง';
      if (this.isAdvancePay(trade)) {
        description += 'และแพ็กเกจค่าบริการล่วงหน้า';
      }
      return {
        description: description,
        installmentType: (trade.banks && !this.isPayment(trade)) ? 'wallet' : 'bath',
        isCashBack: (trade.banks || []).find(bank => bank.remark !== '' && bank.remark !== null && bank.remark),
        freeGoods: (trade.freeGoods || []).map(freeGood => freeGood.name),
        installments: PriceOptionUtils.getInstallmentsFromTrades(
          privilege.trades
        ),
        value: trade
      };
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
