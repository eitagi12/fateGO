import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostValidateCustomerIdCardPageComponent } from './order-pre-to-post-validate-customer-id-card-page.component';

describe('OrderPreToPostValidateCustomerIdCardPageComponent', () => {
  let component: OrderPreToPostValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderPreToPostValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
