import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpValidateCustomerPageComponent } from './order-mnp-validate-customer-page.component';

describe('OrderMnpValidateCustomerPageComponent', () => {
  let component: OrderMnpValidateCustomerPageComponent;
  let fixture: ComponentFixture<OrderMnpValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
