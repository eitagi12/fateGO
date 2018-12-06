import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPrtToPostValidateCustomerRepiPageComponent } from './order-prt-to-post-validate-customer-repi-page.component';

describe('OrderPrtToPostValidateCustomerRepiPageComponent', () => {
  let component: OrderPrtToPostValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<OrderPrtToPostValidateCustomerRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPrtToPostValidateCustomerRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPrtToPostValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
