import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';

@Component({
  selector: 'app-device-order-ais-new-register-perso-sim-page',
  templateUrl: './device-order-ais-new-register-perso-sim-page.component.html',
  styleUrls: ['./device-order-ais-new-register-perso-sim-page.component.scss']
})
export class DeviceOrderAisNewRegisterPersoSimPageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ORDER_AIS;

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void { }

  onBack(): void {
    // this.router.navigate([]);
  }

  onNext(): void {
    // this.router.navigate([]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
