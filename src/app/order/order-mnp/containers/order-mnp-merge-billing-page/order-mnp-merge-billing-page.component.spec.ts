import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpMergeBillingPageComponent } from './order-mnp-merge-billing-page.component';

describe('OrderMnpMergeBillingPageComponent', () => {
  let component: OrderMnpMergeBillingPageComponent;
  let fixture: ComponentFixture<OrderMnpMergeBillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpMergeBillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
