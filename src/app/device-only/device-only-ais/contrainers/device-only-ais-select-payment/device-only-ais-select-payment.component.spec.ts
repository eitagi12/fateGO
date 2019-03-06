import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisSelectPaymentComponent } from './device-only-ais-select-payment.component';

describe('DeviceOnlyAisSelectPaymentComponent', () => {
  let component: DeviceOnlyAisSelectPaymentComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSelectPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisSelectPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisSelectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
