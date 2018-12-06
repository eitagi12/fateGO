import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterFaceComparePageComponent } from './order-new-register-face-compare-page.component';

describe('OrderNewRegisterFaceComparePageComponent', () => {
  let component: OrderNewRegisterFaceComparePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterFaceComparePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterFaceComparePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterFaceComparePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
