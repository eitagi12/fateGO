import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService} from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE } from 'src/app/vas-package/constants/route-path.constant';

@Component({
  selector: 'app-login-with-pin-page',
  templateUrl: './login-with-pin-page.component.html',
  styleUrls: ['./login-with-pin-page.component.scss']
})
export class LoginWithPinPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}
