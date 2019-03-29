import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentSummaryPageComponent } from './deposit-payment-summary-page.component';

describe('DepositPaymentSummaryPageComponent', () => {
  let component: DepositPaymentSummaryPageComponent;
  let fixture: ComponentFixture<DepositPaymentSummaryPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentSummaryPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
