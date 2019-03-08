import { Component, OnInit, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { toDataURL } from 'qrcode';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-payment-display',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-payment-display.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-payment-display.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodePaymentDisplayComponent implements OnInit {
  @Input() textQRCode: string;
  @Input() summaryPriceQRCode: number;
  @Input() qrCodeType: string;
  constructor(
    @Inject(DOCUMENT) private document: any
  ) {

  }

  ngOnInit() {
  }

  ngOnChanges(): void {
    let img: any = this.document.getElementById('qrcode');

    toDataURL(this.textQRCode, { errorCorrectionLevel: 'H' }, (error, url) => {
      if (error) {
        console.error(error);
      }
      img.src = url;
    });
  }

}
