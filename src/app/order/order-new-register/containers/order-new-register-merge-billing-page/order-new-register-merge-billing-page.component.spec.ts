import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterMergeBillingPageComponent } from './order-new-register-merge-billing-page.component';

describe('OrderNewRegisterMergeBillingPageComponent', () => {
  let component: OrderNewRegisterMergeBillingPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterMergeBillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterMergeBillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
