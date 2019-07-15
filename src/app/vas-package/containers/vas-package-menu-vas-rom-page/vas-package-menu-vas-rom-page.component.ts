import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'mychannel-shared-libs';
import { ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE } from 'src/app/vas-package/constants/route-path.constant';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-vas-package-menu-vas-rom-page',
  templateUrl: './vas-package-menu-vas-rom-page.component.html',
  styleUrls: ['./vas-package-menu-vas-rom-page.component.scss']
})
export class VasPackageMenuVasRomPageComponent implements OnInit {
  vasPackageFrom: FormGroup;
  selected: any;
  constructor(
    private router: Router,
    private homeService: HomeService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void {
    this.vasPackageFrom = this.fb.group({
      'vasPackageRom': ['1'],
    });

  }

  onBack(): void {
    // this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
  }

  onNext(): void {
    console.log('this.vasPackageFrom.controls.vasPackageRom.value', this.vasPackageFrom.controls.vasPackageRom.value);
    if (this.vasPackageFrom.controls.vasPackageRom.value === '2') {
      this.router.navigate([ROUTE_VAS_PACKAGE_SELECT_PACKAGE_PAGE]);
    }

  }

  onHome(): void {
    this.homeService.goToHome();
  }

}
