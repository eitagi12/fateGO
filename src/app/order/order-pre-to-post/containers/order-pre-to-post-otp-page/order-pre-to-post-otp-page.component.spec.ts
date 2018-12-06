import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostOtpPageComponent } from './order-pre-to-post-otp-page.component';

describe('OrderPreToPostOtpPageComponent', () => {
  let component: OrderPreToPostOtpPageComponent;
  let fixture: ComponentFixture<OrderPreToPostOtpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostOtpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
