import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_OTP_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE } from 'src/app/vas-package/constants/route-path.constant';

@Component({
  selector: 'app-vas-package-login-with-pin-page',
  templateUrl: './vas-package-login-with-pin-page.component.html',
  styleUrls: ['./vas-package-login-with-pin-page.component.scss']
})
export class VasPackageLoginWithPinPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }
  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_OTP_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}
