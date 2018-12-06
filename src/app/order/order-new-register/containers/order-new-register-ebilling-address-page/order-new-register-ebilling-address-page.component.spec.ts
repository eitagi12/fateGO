import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterEbillingAddressPageComponent } from './order-new-register-ebilling-address-page.component';

describe('OrderNewRegisterEbillingAddressPageComponent', () => {
  let component: OrderNewRegisterEbillingAddressPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterEbillingAddressPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterEbillingAddressPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterEbillingAddressPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
