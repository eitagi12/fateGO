import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-mnp-page',
  templateUrl: './new-share-plan-mnp-perso-sim-mnp-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-mnp-page.component.scss']
})
export class NewSharePlanMnpPersoSimMnpPageComponent implements OnInit {
  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;
  title: string = 'กรุณาเสียบซิมการ์ด';
  constructor() { }

  ngOnInit(): void {
  }

}
