import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceOrderAisExistingBestBuyOmiseGeneratorPageComponent } from './device-order-ais-existing-best-buy-omise-generator-page.component';

describe('DeviceOrderAisExistingBestBuyOmiseGeneratorPageComponent', () => {
  let component: DeviceOrderAisExistingBestBuyOmiseGeneratorPageComponent;
  let fixture: ComponentFixture<DeviceOrderAisExistingBestBuyOmiseGeneratorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAisExistingBestBuyOmiseGeneratorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAisExistingBestBuyOmiseGeneratorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
