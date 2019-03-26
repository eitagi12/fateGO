import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterOneLovePageComponent } from './order-new-register-one-love-page.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('OrderNewRegisterOneLovePageComponent', () => {
  let component: OrderNewRegisterOneLovePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterOneLovePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
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
