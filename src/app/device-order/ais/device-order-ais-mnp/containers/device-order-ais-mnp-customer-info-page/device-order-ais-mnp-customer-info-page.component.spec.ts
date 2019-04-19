import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpCustomerInfoPageComponent } from './device-order-ais-mnp-customer-info-page.component';

describe('DeviceOrderAisMnpCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisMnpCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
