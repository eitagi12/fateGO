import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostMergeBillingPageComponent } from './order-pre-to-post-merge-billing-page.component';

describe('OrderPreToPostMergeBillingPageComponent', () => {
  let component: OrderPreToPostMergeBillingPageComponent;
  let fixture: ComponentFixture<OrderPreToPostMergeBillingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostMergeBillingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostMergeBillingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
