import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetResultPageComponent } from './device-order-ais-existing-gadget-result-page.component';

describe('DeviceOrderAisExistingGadgetResultPageComponent', () => {
  let component: DeviceOrderAisExistingGadgetResultPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
