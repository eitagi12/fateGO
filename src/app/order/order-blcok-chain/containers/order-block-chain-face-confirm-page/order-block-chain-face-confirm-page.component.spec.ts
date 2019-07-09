import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainFaceConfirmPageComponent } from './order-block-chain-face-confirm-page.component';

describe('OrderBlockChainFaceConfirmPageComponent', () => {
  let component: OrderBlockChainFaceConfirmPageComponent;
  let fixture: ComponentFixture<OrderBlockChainFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
