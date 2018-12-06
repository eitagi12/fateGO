import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostOnTopPageComponent } from './order-pre-to-post-on-top-page.component';

describe('OrderPreToPostOnTopPageComponent', () => {
  let component: OrderPreToPostOnTopPageComponent;
  let fixture: ComponentFixture<OrderPreToPostOnTopPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostOnTopPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostOnTopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
