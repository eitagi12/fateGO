import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostCustomerProfilePageComponent } from './order-pre-to-post-customer-profile-page.component';

describe('OrderPreToPostCustomerProfilePageComponent', () => {
  let component: OrderPreToPostCustomerProfilePageComponent;
  let fixture: ComponentFixture<OrderPreToPostCustomerProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostCustomerProfilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
