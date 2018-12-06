import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostValidateCustomerIdCardRepiPageComponent } from './order-pre-to-post-validate-customer-id-card-repi-page.component';

describe('OrderPreToPostValidateCustomerIdCardRepiPageComponent', () => {
  let component: OrderPreToPostValidateCustomerIdCardRepiPageComponent;
  let fixture: ComponentFixture<OrderPreToPostValidateCustomerIdCardRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostValidateCustomerIdCardRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostValidateCustomerIdCardRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
