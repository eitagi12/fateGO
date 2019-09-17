import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingGadgetAggregatePageComponent } from './device-order-ais-existing-gadget-aggregate-page.component';

describe('DeviceOrderAisExistingGadgetAggregatePageComponent', () => {
  let component: DeviceOrderAisExistingGadgetAggregatePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingGadgetAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingGadgetAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingGadgetAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
