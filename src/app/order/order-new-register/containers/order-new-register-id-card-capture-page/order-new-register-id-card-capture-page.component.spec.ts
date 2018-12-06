import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterIdCardCapturePageComponent } from './order-new-register-id-card-capture-page.component';

describe('OrderNewRegisterIdCardCapturePageComponent', () => {
  let component: OrderNewRegisterIdCardCapturePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterIdCardCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterIdCardCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterIdCardCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
