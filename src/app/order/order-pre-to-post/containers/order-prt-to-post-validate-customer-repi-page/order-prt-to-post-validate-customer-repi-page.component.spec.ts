import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPrtToPostValidateCustomerRepiPageComponent } from './order-prt-to-post-validate-customer-repi-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';

describe('OrderPrtToPostValidateCustomerRepiPageComponent', () => {
  let component: OrderPrtToPostValidateCustomerRepiPageComponent;
  let fixture: ComponentFixture<OrderPrtToPostValidateCustomerRepiPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderPrtToPostValidateCustomerRepiPageComponent],
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
    fixture = TestBed.createComponent(OrderPrtToPostValidateCustomerRepiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
