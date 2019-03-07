import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { ReceiptInfo } from '../../components/receipt-information/receipt-information.component';


@Component({
  selector: 'app-device-only-ais-select-payment-and-receipt-information-page',
  templateUrl: './device-only-ais-select-payment-and-receipt-information-page.component.html',
  styleUrls: ['./device-only-ais-select-payment-and-receipt-information-page.component.scss']
})
export class DeviceOnlyAisSelectPaymentAndReceiptInformationPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ONLY_AIS;
  receiptInfo: ReceiptInfo;

  isSuccess: boolean;

  constructor() { }

  ngOnInit() {
    this.receiptInfo = {
      taxId: 'XXXXXXXXX9249',
      branch: 'Telewiz',
      buyer: 'นาย เทส เทส',
      buyerAddress: 'พลหโยธิน 19 แขวงบางซื่อ เขตบางซื่อ กรุงเทพฯ',
      telNo: ''
    };
    console.log('this.receiptInfo', this.receiptInfo);
  }

  onCompleteBillingAddress(billingAddress) {
    console.log('billingAddress', billingAddress);
  }

  onCompleteReceiptInfo(receiptInfo) {
    console.log('billingAddress', receiptInfo);
  }

  onErrorBillingAddress(error: boolean) {
    this.isSuccess = error;
    console.log(this.isSuccess);
  }

  onErrorReceiptInfo(error: boolean) {
    this.isSuccess = error;
    console.log(this.isSuccess);

  }

}
