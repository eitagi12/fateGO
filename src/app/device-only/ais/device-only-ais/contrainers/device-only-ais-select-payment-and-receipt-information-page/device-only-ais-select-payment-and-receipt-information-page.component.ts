import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';

@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ONLY_AIS;

  constructor() { }

  ngOnInit() {
  }

}
