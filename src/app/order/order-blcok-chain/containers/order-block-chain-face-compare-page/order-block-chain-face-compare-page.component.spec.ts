import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainFaceComparePageComponent } from './order-block-chain-face-compare-page.component';

describe('OrderBlockChainFaceComparePageComponent', () => {
  let component: OrderBlockChainFaceComparePageComponent;
  let fixture: ComponentFixture<OrderBlockChainFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
