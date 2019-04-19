import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpAgreementSignPageComponent } from './device-order-ais-mnp-agreement-sign-page.component';

describe('DeviceOrderAisMnpAgreementSignPageComponent', () => {
  let component: DeviceOrderAisMnpAgreementSignPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
