import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpEbillingAddressPageComponent } from './order-mnp-ebilling-address-page.component';

describe('OrderMnpEbillingAddressPageComponent', () => {
  let component: OrderMnpEbillingAddressPageComponent;
  let fixture: ComponentFixture<OrderMnpEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
