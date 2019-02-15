import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostPaymentDetailPageComponent } from './device-order-ais-pre-to-post-payment-detail-page.component';

describe('DeviceOrderAisPreToPostPaymentDetailPageComponent', () => {
  let component: DeviceOrderAisPreToPostPaymentDetailPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
