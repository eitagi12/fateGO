import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterValidateCustomerKeyInPageComponent } from './order-new-register-validate-customer-key-in-page.component';

describe('OrderNewRegisterValidateCustomerKeyInPageComponent', () => {
  let component: OrderNewRegisterValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterValidateCustomerKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterValidateCustomerKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
