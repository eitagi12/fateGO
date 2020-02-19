import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAspSharePlanComponent } from './device-order-asp-share-plan.component';

describe('DeviceOrderAspSharePlanComponent', () => {
  let component: DeviceOrderAspSharePlanComponent;
  let fixture: ComponentFixture<DeviceOrderAspSharePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspSharePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspSharePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
