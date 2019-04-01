import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpAgreementPageComponent } from './device-order-ais-mnp-agreement-page.component';

describe('DeviceOrderAisMnpAgreementPageComponent', () => {
  let component: DeviceOrderAisMnpAgreementPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpAgreementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpAgreementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpAgreementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
