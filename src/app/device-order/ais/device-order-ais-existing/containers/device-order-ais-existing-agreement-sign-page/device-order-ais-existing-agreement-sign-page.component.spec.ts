import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingAgreementSignPageComponent } from './device-order-ais-existing-agreement-sign-page.component';

describe('DeviceOrderAisExistingAgreementSignPageComponent', () => {
  let component: DeviceOrderAisExistingAgreementSignPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
