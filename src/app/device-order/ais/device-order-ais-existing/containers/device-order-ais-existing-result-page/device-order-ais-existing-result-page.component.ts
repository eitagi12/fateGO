import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-order-ais-existing-result-page',
  templateUrl: './device-order-ais-existing-result-page.component.html',
  styleUrls: ['./device-order-ais-existing-result-page.component.scss']
})
export class DeviceOrderAisExistingResultPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) {
  }

  ngOnInit(): void {
  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
