import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE } from 'src/app/order/order-new-register/constants/route-path.constant';
import { HomeService} from 'mychannel-shared-libs';

@Component({
  selector: 'app-order-new-register-verify-document-page',
  templateUrl: './order-new-register-verify-document-page.component.html',
  styleUrls: ['./order-new-register-verify-document-page.component.scss']
})
export class OrderNewRegisterVerifyDocumentPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onNext() {
    this.router.navigate([ROUTE_ORDER_NEW_REGISTER_CONFIRM_USER_INFORMATION_PAGE]);
  }

  onHome() {
    this.homeService.goToHome();
  }

}
