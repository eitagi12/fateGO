import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE, ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE } from '../../constants/route-path.constant';
import { WIZARD_DEVICE_ORDER_AIS } from 'src/app/device-order/constants/wizard.constant';
import { ReceiptInfo } from 'mychannel-shared-libs/lib/component/receipt-info/receipt-info.component';

@Component({
  selector: 'app-device-order-ais-existing-payment-detail-page',
  templateUrl: './device-order-ais-existing-payment-detail-page.component.html',
  styleUrls: ['./device-order-ais-existing-payment-detail-page.component.scss']
})
export class DeviceOrderAisExistingPaymentDetailPageComponent implements OnInit {

  wizards = WIZARD_DEVICE_ORDER_AIS;

  receiptInfo: ReceiptInfo = {
    taxId: '',
    branch: '',
    buyer: '',
    buyerAddress: '',
    telNo: ''
  };

  constructor(
    private router: Router,
    private homeService: HomeService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_MOBILE_DETAIL_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_DEVICE_ORDER_AIS_EXISTING_SELECT_PACKAGE_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}
