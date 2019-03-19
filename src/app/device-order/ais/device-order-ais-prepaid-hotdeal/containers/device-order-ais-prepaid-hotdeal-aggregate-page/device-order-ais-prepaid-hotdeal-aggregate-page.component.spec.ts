import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPrepaidHotdealAggregatePageComponent } from './device-order-ais-prepaid-hotdeal-aggregate-page.component';

describe('DeviceOrderAisPrepaidHotdealAggregatePageComponent', () => {
  let component: DeviceOrderAisPrepaidHotdealAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPrepaidHotdealAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPrepaidHotdealAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPrepaidHotdealAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
