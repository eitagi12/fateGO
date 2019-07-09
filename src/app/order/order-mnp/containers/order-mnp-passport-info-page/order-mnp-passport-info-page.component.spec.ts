import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpPassportInfoPageComponent } from './order-mnp-passport-info-page.component';

describe('OrderMnpPassportInfoPageComponent', () => {
  let component: OrderMnpPassportInfoPageComponent;
  let fixture: ComponentFixture<OrderMnpPassportInfoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpPassportInfoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpPassportInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
