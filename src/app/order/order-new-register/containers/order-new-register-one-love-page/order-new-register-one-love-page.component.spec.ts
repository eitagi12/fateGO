import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterOneLovePageComponent } from './order-new-register-one-love-page.component';

xdescribe('OrderNewRegisterOneLovePageComponent', () => {
  let component: OrderNewRegisterOneLovePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterOneLovePageComponent>;

  setupTestBed({
      declarations: [ OrderNewRegisterOneLovePageComponent ]
    });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterOneLovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
