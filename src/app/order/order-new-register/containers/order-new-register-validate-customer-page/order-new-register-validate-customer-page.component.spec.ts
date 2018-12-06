import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterValidateCustomerPageComponent } from './order-new-register-validate-customer-page.component';

describe('OrderNewRegisterValidateCustomerPageComponent', () => {
  let component: OrderNewRegisterValidateCustomerPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterValidateCustomerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterValidateCustomerPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
