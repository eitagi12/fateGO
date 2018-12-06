import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostOneLoveComponent } from './order-pre-to-post-one-love.component';

describe('OrderPreToPostOneLoveComponent', () => {
  let component: OrderPreToPostOneLoveComponent;
  let fixture: ComponentFixture<OrderPreToPostOneLoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostOneLoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostOneLoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
