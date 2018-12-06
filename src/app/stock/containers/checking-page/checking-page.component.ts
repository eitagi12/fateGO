import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HomeService } from 'mychannel-shared-libs';

@Component({
  selector: 'app-checking-page',
  templateUrl: './checking-page.component.html',
  styleUrls: ['./checking-page.component.scss']
})
export class CheckingPageComponent implements OnInit {

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
