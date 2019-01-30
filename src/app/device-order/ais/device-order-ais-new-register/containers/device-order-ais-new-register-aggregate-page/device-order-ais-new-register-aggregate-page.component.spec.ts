import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisNewRegisterAggregatePageComponent } from './device-order-ais-new-register-aggregate-page.component';

describe('DeviceOrderAisNewRegisterAggregatePageComponent', () => {
  let component: DeviceOrderAisNewRegisterAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisNewRegisterAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisNewRegisterAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisNewRegisterAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
