import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privilegeToTradeSlider'
})
export class PrivilegeToTradeSliderPipe implements PipeTransform {

  transform(privilege: any, args?: any): any {
    if (!privilege) {
      return [];
    }
    return (privilege.trades || []).map((trade: any) => {

      const banks = (trade.banks || []).length > 0;
      const filterIsCashBack = banks
        ? trade.banks.filter(bank => bank.remark !== '' && bank.remark !== null && bank.remark) : [];

      let isPaymentCash;
      if (trade.payments.length > 0) {
        isPaymentCash = trade.payments.find((payment) =>
        payment.method === 'CA' || payment.method === 'CC/CA');
      } else {
        isPaymentCash = true;
      }

      const freeGoods = [];
      trade.freeGoods.forEach(gift => {
          freeGoods.push(gift.name);
      });

      return {
        description: (isPaymentCash ? 'ชำระเต็มจำนวน' : 'ผ่อนชำระค่าเครื่อง')
          + (banks && !isPaymentCash && trade.advancePay && trade.advancePay.installmentFlag === 'Y' ? ' และแพ็กเกจค่าบริการล่วงหน้า' : ''),
        installmentType: (banks && !isPaymentCash) ? 'wallet' : 'bath',
        isCashBack: filterIsCashBack.length > 0 || false,
        freeGoods: freeGoods,
        installments: [{ percentage: 0 , mounth: 3 }],
        value: trade
      };
    });
  }

}
