import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisQrCodeGeneratePageComponent } from './device-only-ais-qr-code-generate-page.component';

describe('DeviceOnlyAisQrCodeGeneratePageComponent', () => {
  let component: DeviceOnlyAisQrCodeGeneratePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeGeneratePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisQrCodeGeneratePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeGeneratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
