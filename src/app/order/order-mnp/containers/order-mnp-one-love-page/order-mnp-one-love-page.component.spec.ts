import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpOneLovePageComponent } from './order-mnp-one-love-page.component';

describe('OrderMnpOneLovePageComponent', () => {
  let component: OrderMnpOneLovePageComponent;
  let fixture: ComponentFixture<OrderMnpOneLovePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpOneLovePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpOneLovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
