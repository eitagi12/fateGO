import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpEbillingPageComponent } from './order-mnp-ebilling-page.component';

describe('OrderMnpEbillingPageComponent', () => {
  let component: OrderMnpEbillingPageComponent;
  let fixture: ComponentFixture<OrderMnpEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
