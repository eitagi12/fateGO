import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpNetworkTypePageComponent } from './order-mnp-network-type-page.component';

describe('OrderMnpCheckNetworkTypePageComponent', () => {
  let component: OrderMnpNetworkTypePageComponent;
  let fixture: ComponentFixture<OrderMnpNetworkTypePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpNetworkTypePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpNetworkTypePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
