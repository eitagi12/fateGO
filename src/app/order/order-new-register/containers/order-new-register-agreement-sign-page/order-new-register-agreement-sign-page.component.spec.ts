import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterAgreementSignPageComponent } from './order-new-register-agreement-sign-page.component';

describe('OrderNewRegisterAgreementSignPageComponent', () => {
  let component: OrderNewRegisterAgreementSignPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
