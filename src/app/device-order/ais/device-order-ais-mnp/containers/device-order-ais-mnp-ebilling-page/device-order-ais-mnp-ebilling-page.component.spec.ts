import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpEbillingPageComponent } from './device-order-ais-mnp-ebilling-page.component';

describe('DeviceOrderAisMnpEbillingPageComponent', () => {
  let component: DeviceOrderAisMnpEbillingPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
