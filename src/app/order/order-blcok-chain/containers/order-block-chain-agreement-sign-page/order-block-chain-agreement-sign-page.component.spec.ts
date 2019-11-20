import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainAgreementSignPageComponent } from './order-block-chain-agreement-sign-page.component';

describe('OrderBlockChainAgreementSignPageComponent', () => {
  let component: OrderBlockChainAgreementSignPageComponent;
  let fixture: ComponentFixture<OrderBlockChainAgreementSignPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainAgreementSignPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainAgreementSignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
