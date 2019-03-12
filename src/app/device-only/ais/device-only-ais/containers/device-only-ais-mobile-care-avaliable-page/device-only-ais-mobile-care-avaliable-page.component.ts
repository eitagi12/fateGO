import { Component, OnInit } from '@angular/core';
import { WIZARD_DEVICE_ONLY_AIS } from '../../constants/wizard.constant';

@Component({
  selector: 'app-device-only-ais-mobile-care-avaliable-page',
  templateUrl: './device-only-ais-mobile-care-avaliable-page.component.html',
  styleUrls: ['./device-only-ais-mobile-care-avaliable-page.component.scss']
})
export class DeviceOnlyAisMobileCareAvaliablePageComponent implements OnInit {

  wizards: string[] = WIZARD_DEVICE_ONLY_AIS;

  constructor(
  ) { }

  ngOnInit(): void {
  }

  public onHome(): void {}

  public onNext(): void {}

  public onBack(): void {}

}
