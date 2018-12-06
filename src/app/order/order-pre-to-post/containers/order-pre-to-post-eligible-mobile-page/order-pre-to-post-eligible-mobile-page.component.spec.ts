import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostEligibleMobilePageComponent } from './order-pre-to-post-eligible-mobile-page.component';

describe('OrderPreToPostEligibleMobilePageComponent', () => {
  let component: OrderPreToPostEligibleMobilePageComponent;
  let fixture: ComponentFixture<OrderPreToPostEligibleMobilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostEligibleMobilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostEligibleMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
