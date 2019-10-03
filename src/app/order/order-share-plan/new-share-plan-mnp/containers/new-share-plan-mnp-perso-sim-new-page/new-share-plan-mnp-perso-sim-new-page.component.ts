import { Component, OnInit } from '@angular/core';
import { WIZARD_ORDER_NEW_REGISTER } from 'src/app/order/constants/wizard.constant';

@Component({
  selector: 'app-new-share-plan-mnp-perso-sim-new-page',
  templateUrl: './new-share-plan-mnp-perso-sim-new-page.component.html',
  styleUrls: ['./new-share-plan-mnp-perso-sim-new-page.component.scss']
})
export class NewSharePlanMnpPersoSimNewPageComponent implements OnInit {

  wizards: string[] = WIZARD_ORDER_NEW_REGISTER;

  constructor() { }

  ngOnInit(): void {
  }

  onBack(): void {

  }
}
