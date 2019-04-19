import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostCustomerProfilePageComponent } from './device-order-ais-pre-to-post-customer-profile-page.component';

describe('DeviceOrderAisPreToPostCustomerProfilePageComponent', () => {
  let component: DeviceOrderAisPreToPostCustomerProfilePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostCustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostCustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
