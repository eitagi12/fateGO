import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostAggregatePageComponent } from './order-pre-to-post-aggregate-page.component';

describe('OrderPreToPostAggregatePageComponent', () => {
  let component: OrderPreToPostAggregatePageComponent;
  let fixture: ComponentFixture<OrderPreToPostAggregatePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostAggregatePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostAggregatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
