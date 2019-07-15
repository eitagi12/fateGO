import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService} from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE, ROUTE_VAS_PACKAGE_LOGIN_WITH_PIN_PAGE } from 'src/app/vas-package/constants/route-path.constant';

@Component({
  selector: 'app-vas-package-otp-page',
  templateUrl: './vas-package-otp-page.component.html',
  styleUrls: ['./vas-package-otp-page.component.scss']
})
export class VasPackageOtpPageComponent implements OnInit {

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
    this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
  }

  onHome(): void {
    this.homeService.goToHome();
  }
}
