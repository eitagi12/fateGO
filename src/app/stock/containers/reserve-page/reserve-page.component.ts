import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-reserve-page',
  templateUrl: './reserve-page.component.html',
  styleUrls: ['./reserve-page.component.scss']
})
export class ReservePageComponent implements OnInit {

  constructor(
    private location: Location,
    private homeService: HomeService
  ) { }

  ngOnInit() {
  }

  onBack() {
    this.location.back();
  }

  onHome() {
    this.homeService.goToHome();
  }
}
