import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-queue-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-queue-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-queue-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeQueuePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate(['']);
  }

}
