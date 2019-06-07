import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPreToPostCurrentInfoPageComponent } from './order-pre-to-post-current-info-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}
describe('OrderPreToPostCurrentInfoPageComponent', () => {
  let component: OrderPreToPostCurrentInfoPageComponent;
  let fixture: ComponentFixture<OrderPreToPostCurrentInfoPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule,
      ModalModule.forRoot()
    ],
    declarations: [
      OrderPreToPostCurrentInfoPageComponent,
      MockMobileNoPipe
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
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                mainPackage: {},
                customer: {},
                simCard: {}
              }
            } as Transaction;
          })
        }
      },
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPreToPostCurrentInfoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
