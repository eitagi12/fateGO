import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterOneLovePageComponent } from './order-new-register-one-love-page.component';

describe('OrderNewRegisterOneLovePageComponent', () => {
  let component: OrderNewRegisterOneLovePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterOneLovePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterOneLovePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterOneLovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
