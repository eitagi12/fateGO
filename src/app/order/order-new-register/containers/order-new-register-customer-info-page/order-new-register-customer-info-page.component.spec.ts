import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterCustomerInfoPageComponent } from './order-new-register-customer-info-page.component';

describe('OrderNewRegisterCustomerInfoPageComponent', () => {
  let component: OrderNewRegisterCustomerInfoPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterCustomerInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterCustomerInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterCustomerInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
