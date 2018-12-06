import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpConfirmUserInformationPageComponent } from './order-mnp-confirm-user-information-page.component';

describe('OrderMnpConfirmUserInformationPageComponent', () => {
  let component: OrderMnpConfirmUserInformationPageComponent;
  let fixture: ComponentFixture<OrderMnpConfirmUserInformationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpConfirmUserInformationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpConfirmUserInformationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
