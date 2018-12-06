import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterEbillingPageComponent } from './order-new-register-ebilling-page.component';

describe('OrderNewRegisterEbillingPageComponent', () => {
  let component: OrderNewRegisterEbillingPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterEbillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterEbillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterEbillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
