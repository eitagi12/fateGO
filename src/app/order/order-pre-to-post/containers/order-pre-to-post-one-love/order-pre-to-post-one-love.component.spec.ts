import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostOneLoveComponent } from './order-pre-to-post-one-love.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('OrderPreToPostOneLoveComponent', () => {
  let component: OrderPreToPostOneLoveComponent;
  let fixture: ComponentFixture<OrderPreToPostOneLoveComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [ OrderPreToPostOneLoveComponent ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostOneLoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
