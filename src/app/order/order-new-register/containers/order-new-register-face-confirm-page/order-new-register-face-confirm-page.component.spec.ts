import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterFaceConfirmPageComponent } from './order-new-register-face-confirm-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';

describe('OrderNewRegisterFaceConfirmPageComponent', () => {
  let component: OrderNewRegisterFaceConfirmPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterFaceConfirmPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ReactiveFormsModule,
      HttpClientModule
    ],
    declarations: [OrderNewRegisterFaceConfirmPageComponent],
    providers: [
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              channelType: ''
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
