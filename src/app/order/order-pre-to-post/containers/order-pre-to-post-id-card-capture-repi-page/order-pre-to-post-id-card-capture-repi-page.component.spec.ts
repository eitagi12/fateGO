import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostIdCardCaptureRepiPageComponent } from './order-pre-to-post-id-card-capture-repi-page.component';

describe('OrderPreToPostIdCardCaptureRepiPageComponent', () => {
  let component: OrderPreToPostIdCardCaptureRepiPageComponent;
  let fixture: ComponentFixture<OrderPreToPostIdCardCaptureRepiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostIdCardCaptureRepiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostIdCardCaptureRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
