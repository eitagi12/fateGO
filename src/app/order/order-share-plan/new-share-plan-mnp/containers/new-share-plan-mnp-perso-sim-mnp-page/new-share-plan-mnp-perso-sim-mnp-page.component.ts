import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_SHARE_PLAN_MNP } from 'src/app/order/constants/wizard.constant';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from 'mychannel-shared-libs';
import { ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-mnp-page',
  templateUrl: './new-share-plan-mnp-perso-sim-mnp-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-mnp-page.component.scss']
})
export class NewSharePlanMnpPersoSimMnpPageComponent implements OnInit {
  wizards: string[] = WIZARD_ORDER_NEW_SHARE_PLAN_MNP;
  title: string = 'กรุณาเสียบซิมการ์ด';
  constructor(
    private router: Router,
    private http: HttpClient,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  onNext(): void {
    this.router.navigate([ROUTE_NEW_SHARE_PLAN_MNP_RESULT_PAGE]);
  }

}
