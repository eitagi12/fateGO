import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealMobileCarePageComponent } from './device-order-ais-prepaid-hotdeal-mobile-care-page.component';

describe('DeviceOrderAisPrepaidHotdealMobileCarePageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealMobileCarePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
