import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterEapplicationPageComponent } from './order-new-register-eapplication-page.component';

describe('OrderNewRegisterEapplicationPageComponent', () => {
  let component: OrderNewRegisterEapplicationPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterEapplicationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterEapplicationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterEapplicationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
