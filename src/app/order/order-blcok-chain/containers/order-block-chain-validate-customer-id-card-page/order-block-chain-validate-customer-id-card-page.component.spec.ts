import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainValidateCustomerIdCardPageComponent } from './order-block-chain-validate-customer-id-card-page.component';

describe('OrderBlockChainValidateCustomerIdCardPageComponent', () => {
  let component: OrderBlockChainValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderBlockChainValidateCustomerIdCardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainValidateCustomerIdCardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
