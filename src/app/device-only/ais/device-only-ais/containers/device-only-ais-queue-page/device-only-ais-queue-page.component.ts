import { Component, OnInit, OnDestroy } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-only-ais-queue-page',
  templateUrl: './device-only-ais-queue-page.component.html',
  styleUrls: ['./device-only-ais-queue-page.component.scss']
})
export class DeviceOnlyAisQueuePageComponent implements OnInit, OnDestroy {

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
  }

  onHome(): void {
    this.homeService.goToHome();
  }

  mainMenu(): void {
    this.homeService.goToHome();
  }

  ngOnDestroy(): void {

  }

}
