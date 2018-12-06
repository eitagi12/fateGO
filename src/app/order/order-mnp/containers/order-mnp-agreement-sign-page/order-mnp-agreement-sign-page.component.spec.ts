import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpAgreementSignPageComponent } from './order-mnp-agreement-sign-page.component';

describe('OrderMnpAgreementSignPageComponent', () => {
  let component: OrderMnpAgreementSignPageComponent;
  let fixture: ComponentFixture<OrderMnpAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
