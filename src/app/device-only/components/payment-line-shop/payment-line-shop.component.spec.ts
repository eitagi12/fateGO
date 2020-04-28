import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentLineShopComponent } from './payment-line-shop.component';

describe('PaymentLineShopComponent', () => {
  let component: PaymentLineShopComponent;
  let fixture: ComponentFixture<PaymentLineShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentLineShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentLineShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
