import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentPageComponent } from './deposit-payment-page.component';

describe('DepositPaymentPageComponent', () => {
  let component: DepositPaymentPageComponent;
  let fixture: ComponentFixture<DepositPaymentPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
