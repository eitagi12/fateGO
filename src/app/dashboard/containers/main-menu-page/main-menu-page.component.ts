import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLoadingService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-main-menu-page',
  templateUrl: './main-menu-page.component.html',
  styleUrls: ['./main-menu-page.component.scss']
})
export class MainMenuPageComponent implements OnInit {

  constructor(
    private router: Router,
    private pageLoadingService: PageLoadingService,
  ) { }

  ngOnInit() {
  }

  goPage(page: string) {
    this.pageLoadingService.openLoading();
    this.router.navigate([page]).then(() => {
      this.pageLoadingService.closeLoading();
    });
  }


}
