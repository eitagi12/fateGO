import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingEligibleMobilePageComponent } from './device-order-ais-existing-eligible-mobile-page.component';

describe('DeviceOrderAisExistingEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisExistingEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
