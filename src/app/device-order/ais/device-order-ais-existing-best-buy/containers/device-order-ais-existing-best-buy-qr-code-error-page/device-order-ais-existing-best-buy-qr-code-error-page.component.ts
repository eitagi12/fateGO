import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-order-ais-existing-best-buy-qr-code-error-page',
  templateUrl: './device-order-ais-existing-best-buy-qr-code-error-page.component.html',
  styleUrls: ['./device-order-ais-existing-best-buy-qr-code-error-page.component.scss']
})
export class DeviceOrderAisExistingBestBuyQrCodeErrorPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
  }

  onBack(): void {
    this.router.navigate(['']);
  }

  onHome(): void {

  }

}
