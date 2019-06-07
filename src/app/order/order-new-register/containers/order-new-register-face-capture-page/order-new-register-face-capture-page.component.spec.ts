import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterFaceCapturePageComponent } from './order-new-register-face-capture-page.component';
import { RouterTestingModule } from '@angular/router/testing';

xdescribe('OrderNewRegisterFaceCapturePageComponent', () => {
  let component: OrderNewRegisterFaceCapturePageComponent;
  let fixture: ComponentFixture<OrderNewRegisterFaceCapturePageComponent>;

  setupTestBed({
    imports: [RouterTestingModule],
    declarations: [ OrderNewRegisterFaceCapturePageComponent ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterFaceCapturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
