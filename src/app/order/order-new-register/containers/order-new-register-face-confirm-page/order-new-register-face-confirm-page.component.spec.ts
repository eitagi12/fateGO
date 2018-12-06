import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterFaceConfirmPageComponent } from './order-new-register-face-confirm-page.component';

describe('OrderNewRegisterFaceConfirmPageComponent', () => {
  let component: OrderNewRegisterFaceConfirmPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterFaceConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterFaceConfirmPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
