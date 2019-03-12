import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE, ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE } from '../../constants/route-path.constant';

@Component({
  selector: 'app-mobile-care-avaliable',
  templateUrl: './mobile-care-avaliable.component.html',
  styleUrls: ['./mobile-care-avaliable.component.scss']
})
export class MobileCareAvaliableComponent implements OnInit {
  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public onBack(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SELECT_PAYMENT_AND_RECEIPT_INFORMATION_PAGE]);
  }
  public onHome(): void {
    // do something
  }

  public onNext(): void {
    this.router.navigate([ROUTE_DEVICE_ONLY_AIS_SUMMARY_PAGE]);
  }
}
