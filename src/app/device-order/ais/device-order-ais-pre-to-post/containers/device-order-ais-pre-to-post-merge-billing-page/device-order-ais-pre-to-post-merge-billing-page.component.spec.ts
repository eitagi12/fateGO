import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostMergeBillingPageComponent } from './device-order-ais-pre-to-post-merge-billing-page.component';

describe('DeviceOrderAisPreToPostMergeBillingPageComponent', () => {
  let component: DeviceOrderAisPreToPostMergeBillingPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostMergeBillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostMergeBillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
