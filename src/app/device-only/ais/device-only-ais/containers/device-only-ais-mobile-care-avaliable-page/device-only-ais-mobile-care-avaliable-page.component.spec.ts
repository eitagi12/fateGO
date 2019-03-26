
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAisMobileCareAvaliablePageComponent } from './device-only-ais-mobile-care-avaliable-page.component';

describe('DeviceOnlyAisMobileCareAvaliablePageComponent', () => {
  let component: DeviceOnlyAisMobileCareAvaliablePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisMobileCareAvaliablePageComponent>;

  setupTestBed({
    declarations: [DeviceOnlyAisMobileCareAvaliablePageComponent]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisMobileCareAvaliablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
