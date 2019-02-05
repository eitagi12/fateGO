import { Pipe, PipeTransform } from '@angular/core';

enum PaymentTypeConstant {
  CASH_PAYMENT = 'CA',
  CREDIT_CARD_PAYMENT = 'CC',
  CREDIT_CARD_AND_CASH_PAYMENT = 'CC/CA',
}

@Pipe({
  name: 'privilegeToTradeSlider'
})
export class PrivilegeToTradeSliderPipe implements PipeTransform {

  transform(privilege: any, args?: any): any {
    if (!privilege) {
      return [];
    }
    return (privilege.trades || []).map((trade: any) => {
      // console.log('(privilege.trades', trade);

      const banks = (trade.banks || []).length > 0;
      const filterIsCashBack = banks
        ? trade.banks.filter(bank => bank.remark !== '' && bank.remark !== null && bank.remark) : [];

      let isPaymentCash;
      if (trade.payments.length > 0) {
        isPaymentCash = trade.payments.find((payment) =>
        payment.method === PaymentTypeConstant.CASH_PAYMENT || payment.method === PaymentTypeConstant.CREDIT_CARD_AND_CASH_PAYMENT);
      } else {
        isPaymentCash = true;
      }

      return {
        description: (isPaymentCash ? 'ชำระเต็มจำนวน' : 'ผ่อนชำระค่าเครื่อง')
          + (banks && !isPaymentCash && trade.advancePay && trade.advancePay.installmentFlag === 'Y' ? ' และแพ็กเกจค่าบริการล่วงหน้า' : ''),
        installmentType: (banks && !isPaymentCash) ? 'wallet' : 'bath',
        isCashBack: filterIsCashBack.length > 0 || false,
        value: trade
      };
    });
  }

}
