import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostCustomerInfoPageComponent } from './device-order-ais-pre-to-post-customer-info-page.component';

describe('DeviceOrderAisPreToPostCustomerInfoPageComponent', () => {
  let component: DeviceOrderAisPreToPostCustomerInfoPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
