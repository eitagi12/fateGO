import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostValidateCustomerPageComponent } from './order-pre-to-post-validate-customer-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';

describe('OrderPreToPostValidateCustomerPageComponent', () => {
  let component: OrderPreToPostValidateCustomerPageComponent;
  let fixture: ComponentFixture<OrderPreToPostValidateCustomerPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderPreToPostValidateCustomerPageComponent],
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
    fixture = TestBed.createComponent(OrderPreToPostValidateCustomerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
