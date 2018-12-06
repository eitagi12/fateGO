import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostSelectPackagePageComponent } from './order-pre-to-post-select-package-page.component';

describe('OrderPreToPostSelectPackagePageComponent', () => {
  let component: OrderPreToPostSelectPackagePageComponent;
  let fixture: ComponentFixture<OrderPreToPostSelectPackagePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPreToPostSelectPackagePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
