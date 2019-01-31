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
      return {
        description: banks ? 'ผ่อนชำระค่าเครื่อง' : 'ชำระเต็มจำนวน',
        installmentType: banks ? 'wallet' : 'bath',
        isCashBack: filterIsCashBack.length > 0 || false,
        value: trade
      };
    });
  }

}
