import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent } from './device-order-ais-existing-gadget-validate-identify-id-card-page.component';

describe('DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetValidateIdentifyIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
