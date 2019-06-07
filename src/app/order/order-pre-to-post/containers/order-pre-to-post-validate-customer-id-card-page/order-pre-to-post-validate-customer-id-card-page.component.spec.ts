import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostValidateCustomerIdCardPageComponent } from './order-pre-to-post-validate-customer-id-card-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';

describe('OrderPreToPostValidateCustomerIdCardPageComponent', () => {
  let component: OrderPreToPostValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OrderPreToPostValidateCustomerIdCardPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderPreToPostValidateCustomerIdCardPageComponent],
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
    fixture = TestBed.createComponent(OrderPreToPostValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
