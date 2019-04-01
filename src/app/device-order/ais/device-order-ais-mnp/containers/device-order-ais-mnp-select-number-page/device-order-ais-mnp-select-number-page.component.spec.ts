import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpSelectNumberPageComponent } from './device-order-ais-mnp-select-number-page.component';

describe('DeviceOrderAisMnpSelectNumberPageComponent', () => {
  let component: DeviceOrderAisMnpSelectNumberPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpSelectNumberPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpSelectNumberPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpSelectNumberPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
