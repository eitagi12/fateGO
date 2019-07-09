import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainResultPageComponent } from './order-block-chain-result-page.component';

describe('OrderBlockChainResultPageComponent', () => {
  let component: OrderBlockChainResultPageComponent;
  let fixture: ComponentFixture<OrderBlockChainResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
