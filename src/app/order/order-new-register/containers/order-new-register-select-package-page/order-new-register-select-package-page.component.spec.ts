import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterSelectPackagePageComponent } from './order-new-register-select-package-page.component';

describe('OrderNewRegisterSelectPackagePageComponent', () => {
  let component: OrderNewRegisterSelectPackagePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderNewRegisterSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
