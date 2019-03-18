import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentSummaryComponent } from './deposit-payment-summary.component';

describe('DepositPaymentSummaryComponent', () => {
  let component: DepositPaymentSummaryComponent;
  let fixture: ComponentFixture<DepositPaymentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
