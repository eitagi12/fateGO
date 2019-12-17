import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterMnpPaymentDetailPageComponent } from './new-register-mnp-payment-detail-page.component';

describe('NewRegisterMnpPaymentDetailPageComponent', () => {
  let component: NewRegisterMnpPaymentDetailPageComponent;
  let fixture: ComponentFixture<NewRegisterMnpPaymentDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegisterMnpPaymentDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegisterMnpPaymentDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
