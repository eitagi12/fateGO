import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostEbillingPageComponent } from './device-order-ais-pre-to-post-ebilling-page.component';

describe('DeviceOrderAisPreToPostEbillingPageComponent', () => {
  let component: DeviceOrderAisPreToPostEbillingPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
