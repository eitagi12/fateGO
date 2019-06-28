import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetValidateIdentifyPageComponent } from './device-order-ais-existing-gadget-validate-identify-page.component';

describe('DeviceOrderAisExistingGadgetValidateIdentifyPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetValidateIdentifyPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetValidateIdentifyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetValidateIdentifyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetValidateIdentifyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
