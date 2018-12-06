import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpValidateCustomerIdCardPageComponent } from './order-mnp-validate-customer-id-card-page.component';

describe('OrderMnpValidateCustomerIdCardPageComponent', () => {
  let component: OrderMnpValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderMnpValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
