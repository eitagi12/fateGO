import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostEapplicationPageComponent } from './order-pre-to-post-eapplication-page.component';

describe('OrderPreToPostEapplicationPageComponent', () => {
  let component: OrderPreToPostEapplicationPageComponent;
  let fixture: ComponentFixture<OrderPreToPostEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
