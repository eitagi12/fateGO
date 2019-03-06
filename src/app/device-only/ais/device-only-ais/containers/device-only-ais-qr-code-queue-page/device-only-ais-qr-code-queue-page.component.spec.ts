import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOnlyAisQrCodeQueuePageComponent } from './device-only-ais-qr-code-queue-page.component';

describe('DeviceOnlyAisQrCodeQueuePageComponent', () => {
  let component: DeviceOnlyAisQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOnlyAisQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
