import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBlockChainFaceCapturePageComponent } from './order-block-chain-face-capture-page.component';

describe('OrderBlockChainFaceCapturePageComponent', () => {
  let component: OrderBlockChainFaceCapturePageComponent;
  let fixture: ComponentFixture<OrderBlockChainFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBlockChainFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBlockChainFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
