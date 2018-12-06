import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostValidateCustomerPageComponent } from './order-pre-to-post-validate-customer-page.component';

describe('OrderPreToPostValidateCustomerPageComponent', () => {
  let component: OrderPreToPostValidateCustomerPageComponent;
  let fixture: ComponentFixture<OrderPreToPostValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
