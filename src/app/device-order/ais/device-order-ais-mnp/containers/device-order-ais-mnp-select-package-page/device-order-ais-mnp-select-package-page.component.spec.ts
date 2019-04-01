import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisMnpSelectPackagePageComponent } from './device-order-ais-mnp-select-package-page.component';

describe('DeviceOrderAisMnpSelectPackagePageComponent', () => {
  let component: DeviceOrderAisMnpSelectPackagePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisMnpSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisMnpSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisMnpSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
