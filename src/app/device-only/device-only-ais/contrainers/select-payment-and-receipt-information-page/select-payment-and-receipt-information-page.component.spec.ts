import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymentAndReceiptInformationPageComponent } from './select-payment-and-receipt-information-page.component';

describe('SelectPaymentAndReceiptInformationPageComponent', () => {
  let component: SelectPaymentAndReceiptInformationPageComponent;
  let fixture: ComponentFixture<SelectPaymentAndReceiptInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPaymentAndReceiptInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPaymentAndReceiptInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
