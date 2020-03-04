import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderTelewizSharePlanComponent } from './device-order-telewiz-share-plan.component';

describe('DeviceOrderTelewizSharePlanComponent', () => {
  let component: DeviceOrderTelewizSharePlanComponent;
  let fixture: ComponentFixture<DeviceOrderTelewizSharePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderTelewizSharePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderTelewizSharePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
