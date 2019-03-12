import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ORDER_ASP } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-mobile-care-avaliable',
  templateUrl: './mobile-care-avaliable.component.html',
  styleUrls: ['./mobile-care-avaliable.component.scss']
})
export class MobileCareAvaliableComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ORDER_ASP;

  constructor() { }

  ngOnInit(): void {
  }

}
