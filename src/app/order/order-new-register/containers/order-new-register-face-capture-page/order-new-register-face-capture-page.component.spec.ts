import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterFaceCapturePageComponent } from './order-new-register-face-capture-page.component';

describe('OrderNewRegisterFaceCapturePageComponent', () => {
  let component: OrderNewRegisterFaceCapturePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterFaceCapturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterFaceCapturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
