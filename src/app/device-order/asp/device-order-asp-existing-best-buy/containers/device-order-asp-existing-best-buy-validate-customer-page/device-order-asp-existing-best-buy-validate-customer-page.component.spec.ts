import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOrderAspExistingBestBuyValidateCustomerPageComponent } from './device-order-asp-existing-best-buy-validate-customer-page.component';

describe('DeviceOrderAisExistingBestBuyValidateCustomerPageComponent', () => {
  let component: DeviceOrderAspExistingBestBuyValidateCustomerPageComponent;
  let fixture: ComponentFixture<DeviceOrderAspExistingBestBuyValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceOrderAspExistingBestBuyValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOrderAspExistingBestBuyValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
