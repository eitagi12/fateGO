import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpOnTopPageComponent } from './order-mnp-on-top-page.component';

describe('OrderMnpOnTopPageComponent', () => {
  let component: OrderMnpOnTopPageComponent;
  let fixture: ComponentFixture<OrderMnpOnTopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpOnTopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpOnTopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
