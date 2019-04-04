import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisPreToPostQrCodeQueuePageComponent } from './device-order-ais-pre-to-post-qr-code-queue-page.component';

describe('DeviceOrderAisPreToPostQrCodeQueuePageComponent', () => {
  let component: DeviceOrderAisPreToPostQrCodeQueuePageComponent;
  let fixture: ComponentFixture<DeviceOrderAisPreToPostQrCodeQueuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisPreToPostQrCodeQueuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisPreToPostQrCodeQueuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
