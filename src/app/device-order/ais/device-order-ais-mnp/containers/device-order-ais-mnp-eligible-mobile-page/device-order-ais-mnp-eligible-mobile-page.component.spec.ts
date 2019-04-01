import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpEligibleMobilePageComponent } from './device-order-ais-mnp-eligible-mobile-page.component';

describe('DeviceOrderAisMnpEligibleMobilePageComponent', () => {
  let component: DeviceOrderAisMnpEligibleMobilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
