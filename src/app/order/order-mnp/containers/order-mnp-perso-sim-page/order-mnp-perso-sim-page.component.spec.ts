import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpPersoSimPageComponent } from './order-mnp-perso-sim-page.component';

describe('OrderMnpPersoSimPageComponent', () => {
  let component: OrderMnpPersoSimPageComponent;
  let fixture: ComponentFixture<OrderMnpPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
