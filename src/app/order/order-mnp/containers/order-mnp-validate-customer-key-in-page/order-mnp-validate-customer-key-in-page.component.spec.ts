import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpValidateCustomerKeyInPageComponent } from './order-mnp-validate-customer-key-in-page.component';

describe('OrderMnpValidateCustomerKeyInPageComponent', () => {
  let component: OrderMnpValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<OrderMnpValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
