import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentReceiptPageComponent } from './deposit-payment-receipt-page.component';

describe('DepositPaymentReceiptPageComponent', () => {
  let component: DepositPaymentReceiptPageComponent;
  let fixture: ComponentFixture<DepositPaymentReceiptPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentReceiptPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentReceiptPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
