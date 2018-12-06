import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpIdCardCapturePageComponent } from './order-mnp-id-card-capture-page.component';

describe('OrderMnpIdCardCapturePageComponent', () => {
  let component: OrderMnpIdCardCapturePageComponent;
  let fixture: ComponentFixture<OrderMnpIdCardCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpIdCardCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
