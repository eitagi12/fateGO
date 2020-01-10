import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPaymentDetailComponent } from './shop-payment-detail.component';

describe('ShopPaymentDetailComponent', () => {
  let component: ShopPaymentDetailComponent;
  let fixture: ComponentFixture<ShopPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
