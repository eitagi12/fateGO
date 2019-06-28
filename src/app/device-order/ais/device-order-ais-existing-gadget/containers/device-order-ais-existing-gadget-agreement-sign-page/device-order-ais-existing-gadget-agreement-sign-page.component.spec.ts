import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetAgreementSignPageComponent } from './device-order-ais-existing-gadget-agreement-sign-page.component';

describe('DeviceOrderAisExistingGadgetAgreementSignPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetAgreementSignPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
