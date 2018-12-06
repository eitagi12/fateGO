import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostEbillingAddressPageComponent } from './order-pre-to-post-ebilling-address-page.component';

describe('OrderPreToPostEbillingAddressPageComponent', () => {
  let component: OrderPreToPostEbillingAddressPageComponent;
  let fixture: ComponentFixture<OrderPreToPostEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
