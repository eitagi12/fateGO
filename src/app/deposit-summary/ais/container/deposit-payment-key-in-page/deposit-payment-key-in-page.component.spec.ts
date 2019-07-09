import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositPaymentKeyInPageComponent } from './deposit-payment-key-in-page.component';

describe('DepositPaymentKeyInPageComponent', () => {
  let component: DepositPaymentKeyInPageComponent;
  let fixture: ComponentFixture<DepositPaymentKeyInPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositPaymentKeyInPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepositPaymentKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
