import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterValidateCustomerIdCardPageComponent } from './order-new-register-validate-customer-id-card-page.component';

describe('OrderNewRegisterValidateCustomerIdCardPageComponent', () => {
  let component: OrderNewRegisterValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
