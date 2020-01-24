import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'privilegeToTradeSlider'
})
export class PrivilegeToTradeSliderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
