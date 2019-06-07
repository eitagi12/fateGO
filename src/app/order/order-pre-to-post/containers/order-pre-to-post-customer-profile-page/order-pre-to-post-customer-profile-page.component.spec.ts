import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostCustomerProfilePageComponent } from './order-pre-to-post-customer-profile-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('OrderPreToPostCustomerProfilePageComponent', () => {
  let component: OrderPreToPostCustomerProfilePageComponent;
  let fixture: ComponentFixture<OrderPreToPostCustomerProfilePageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderPreToPostCustomerProfilePageComponent, MockMobileNoPipe],
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
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                mainPackage: {},
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostCustomerProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
