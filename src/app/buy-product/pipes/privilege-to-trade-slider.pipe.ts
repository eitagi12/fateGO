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

      // bank
      const banks = (trade.banks || []).length > 0;
      const filterIsCashBack = banks
        ? trade.banks.filter(bank => bank.remark !== '' && bank.remark !== null && bank.remark) : [];
      const installments = banks ? this.getInstallments(trade.banks) : [];

      // CashBack
      const isCashBack = filterIsCashBack.length > 0 || false;

      // Gift
      const freeGoods = [];
      trade.freeGoods.forEach(gift => { freeGoods.push(gift.name); });

      // description
      const isPaymentCash = trade.payments.length
      ? trade.payments.find((payment) => payment.method === 'CA' || payment.method === 'CC/CA') : true;
      const description = (isPaymentCash ? 'ชำระเต็มจำนวน' : 'ผ่อนชำระค่าเครื่อง')
      + (banks && !isPaymentCash && trade.advancePay && trade.advancePay.installmentFlag === 'Y' ? ' และแพ็กเกจค่าบริการล่วงหน้า' : '');


      return {
        description: description,
        installmentType: (banks && !isPaymentCash) ? 'wallet' : 'bath',
        isCashBack: isCashBack,
        freeGoods: freeGoods,
        installments: installments,
        value: trade
      };
    });
  }

  getInstallments(banks: any) {
    const installmentGroups = banks.reduce((previousValue: any, currentValue: any) => {
      const keys: string[] = (currentValue.installment || '').split(/(%|เดือน)/);
      const groupKey = `${(keys[0] || '').trim()}-${(keys[2] || '').trim()}`;
      if (!previousValue[groupKey]) {
          previousValue[groupKey] = [currentValue];
      } else {
          const bankExist = previousValue[groupKey].find((bank: any) => bank.abb === currentValue.abb);
          if (!bankExist) {
              previousValue[groupKey].push(currentValue);
          }
      }
      return previousValue;
  }, {});
    const installments = [];
        Object.keys(installmentGroups).forEach((key: any) => {
            const keys: string[] = key.split('-');
            if (+keys[0] === 0 && +keys[1] === 0) {
                return;
            }
            installments.push({
                percentage: +keys[0] || 0,
                month: +keys[1] || 0,
                banks: installmentGroups[key]
            });
        });
        // จ่ายน้อยผ่อนนาน
        return installments.sort((a: any, b: any) => {
            return a.month > b.month ? -1 : 1;
        });
  }

}
