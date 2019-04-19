import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingEcontractPageComponent } from './device-order-ais-existing-econtract-page.component';

describe('DeviceOrderAisExistingEcontractPageComponent', () => {
  let component: DeviceOrderAisExistingEcontractPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingEcontractPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingEcontractPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingEcontractPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
