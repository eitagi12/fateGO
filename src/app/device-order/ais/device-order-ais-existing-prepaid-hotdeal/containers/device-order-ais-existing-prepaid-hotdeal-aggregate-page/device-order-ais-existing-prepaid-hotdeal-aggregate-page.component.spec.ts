import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent } from './device-order-ais-existing-prepaid-hotdeal-aggregate-page.component';

describe('DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent', () => {
  let component: DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingPrepaidHotdealAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
