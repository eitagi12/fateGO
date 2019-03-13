import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Router } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-device-only-ais-select-mobile-care-page',
  templateUrl: './device-only-ais-select-mobile-care-page.component.html',
  styleUrls: ['./device-only-ais-select-mobile-care-page.component.scss']
})
export class DeviceOnlyAisSelectMobileCarePageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  }

  public onHome(): void {
    // do something
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }

}
