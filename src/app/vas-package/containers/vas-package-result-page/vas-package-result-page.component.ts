import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE, ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE } from 'src/app/vas-package/constants/route-path.constant';

@Component({
  selector: 'app-vas-package-result-page',
  templateUrl: './vas-package-result-page.component.html',
  styleUrls: ['./vas-package-result-page.component.scss']
})
export class VasPackageResultPageComponent implements OnInit {

  constructor(
    private router: Router,
    private homeService: HomeService,
  ) { }

  ngOnInit(): void {
  }

  onHome(): void {
    this.homeService.goToHome();
  }
  onBack(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_CURRENT_BALANCE_PAGE]);
  }

  onMainMenu(): void {
    window.location.href = '/sales-portal/easyapp/new-vas/packlist';
  }
  onToup(): void {
    window.location.href = '/sales-portal/easyapp/new-vas/packlist';
  }
  onSelectPackage(): void {
    this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }
}
