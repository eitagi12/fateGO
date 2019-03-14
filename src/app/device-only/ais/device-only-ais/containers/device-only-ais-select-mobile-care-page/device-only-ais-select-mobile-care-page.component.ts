import { Component, OnInit } from '@angular/core';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-device-only-ais-select-mobile-care-page',
  templateUrl: './device-only-ais-select-mobile-care-page.component.html',
  styleUrls: ['./device-only-ais-select-mobile-care-page.component.scss']
})
export class DeviceOnlyAisSelectMobileCarePageComponent implements OnInit {
  public isVerify: boolean = false;
  public promotionMock: any = [{
    id: '1',
    title: 'AIS Mobile Care-Swap+Replace เหมาจ่าย 12 เดือน 969',
    priceExclVat: '969'
  },
  {
    id: '2',
    title: 'AIS Mobile Care-Swap+Replace รายเดือน 89 บาท',
    priceExclVat: '89'
  }];

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit(): void {
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  }

  public onHome(): void {
    this.homeService.goToHome();
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }

  public checkVerify(verify: boolean): void {
    this.isVerify = verify;
  }

}
