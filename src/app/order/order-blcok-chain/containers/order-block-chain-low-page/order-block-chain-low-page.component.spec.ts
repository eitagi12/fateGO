import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainLowPageComponent } from './order-block-chain-low-page.component';

describe('OrderBlockChainLowPageComponent', () => {
  let component: OrderBlockChainLowPageComponent;
  let fixture: ComponentFixture<OrderBlockChainLowPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainLowPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainLowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
