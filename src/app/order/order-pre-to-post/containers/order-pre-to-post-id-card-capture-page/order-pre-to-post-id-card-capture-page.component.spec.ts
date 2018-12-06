import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostIdCardCapturePageComponent } from './order-pre-to-post-id-card-capture-page.component';

describe('OrderPreToPostIdCardCapturePageComponent', () => {
  let component: OrderPreToPostIdCardCapturePageComponent;
  let fixture: ComponentFixture<OrderPreToPostIdCardCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostIdCardCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
