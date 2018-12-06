import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpSelectPackagePageComponent } from './order-mnp-select-package-page.component';

describe('OrderMnpSelectPackagePageComponent', () => {
  let component: OrderMnpSelectPackagePageComponent;
  let fixture: ComponentFixture<OrderMnpSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMnpSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
