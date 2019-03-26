import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterValidateCustomerKeyInPageComponent } from './order-new-register-validate-customer-key-in-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';

describe('OrderNewRegisterValidateCustomerKeyInPageComponent', () => {
  let component: OrderNewRegisterValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterValidateCustomerKeyInPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderNewRegisterValidateCustomerKeyInPageComponent],
    providers: [
      LocalStorageService,
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
    fixture = TestBed.createComponent(OrderNewRegisterValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
