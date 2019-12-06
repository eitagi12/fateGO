import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisSharePlanComponent } from './device-order-ais-share-plan.component';

describe('DeviceOrderAisSharePlanComponent', () => {
  let component: DeviceOrderAisSharePlanComponent;
  let fixture: ComponentFixture<DeviceOrderAisSharePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisSharePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisSharePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
