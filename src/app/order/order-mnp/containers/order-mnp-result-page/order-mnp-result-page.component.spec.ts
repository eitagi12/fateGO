import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpResultPageComponent } from './order-mnp-result-page.component';

describe('OrderMnpResultPageComponent', () => {
  let component: OrderMnpResultPageComponent;
  let fixture: ComponentFixture<OrderMnpResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
