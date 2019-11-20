import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainEligibleMobilePageComponent } from './order-block-chain-eligible-mobile-page.component';

describe('OrderBlockChainEligibleMobilePageComponent', () => {
  let component: OrderBlockChainEligibleMobilePageComponent;
  let fixture: ComponentFixture<OrderBlockChainEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
