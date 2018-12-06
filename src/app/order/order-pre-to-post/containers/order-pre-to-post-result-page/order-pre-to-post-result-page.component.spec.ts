import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostResultPageComponent } from './order-pre-to-post-result-page.component';

describe('OrderPreToPostResultPageComponent', () => {
  let component: OrderPreToPostResultPageComponent;
  let fixture: ComponentFixture<OrderPreToPostResultPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostResultPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
