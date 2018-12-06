import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterPersoSimPageComponent } from './order-new-register-perso-sim-page.component';

describe('OrderNewRegisterPersoSimPageComponent', () => {
  let component: OrderNewRegisterPersoSimPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterPersoSimPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterPersoSimPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
