import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealResultPageComponent } from './device-order-ais-prepaid-hotdeal-result-page.component';

describe('DeviceOrderAisPrepaidHotdealResultPageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
