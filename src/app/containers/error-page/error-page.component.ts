import { Component, OnInit } from '@angular/core';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
  }

  onToHome() {
    this.homeService.goToHome();
  }
}
