import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostCustomerInfoPageComponent } from './order-pre-to-post-customer-info-page.component';

describe('OrderPreToPostCustomerInfoPageComponent', () => {
  let component: OrderPreToPostCustomerInfoPageComponent;
  let fixture: ComponentFixture<OrderPreToPostCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
