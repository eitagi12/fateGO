import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterValidateCustomerIdCardPageComponent } from './order-new-register-validate-customer-id-card-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';

describe('OrderNewRegisterValidateCustomerIdCardPageComponent', () => {
  let component: OrderNewRegisterValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterValidateCustomerIdCardPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule,
    ],
    declarations: [
      OrderNewRegisterValidateCustomerIdCardPageComponent
    ],
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
    fixture = TestBed.createComponent(OrderNewRegisterValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
