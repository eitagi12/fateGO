import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpCustomerInfoPageComponent } from './order-mnp-customer-info-page.component';

describe('OrderMnpCustomerInfoPageComponent', () => {
  let component: OrderMnpCustomerInfoPageComponent;
  let fixture: ComponentFixture<OrderMnpCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
