import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewRegisterPersoSimPageComponent } from './order-new-register-perso-sim-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderNewRegisterPersoSimPageComponent', () => {
  let component: OrderNewRegisterPersoSimPageComponent;
  let fixture: ComponentFixture<OrderNewRegisterPersoSimPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderNewRegisterPersoSimPageComponent],
    providers: [
      LocalStorageService,
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                customer: {},
                simCard: {
                  mobileNo: ''
                }
              }
            } as Transaction;
          })
        }
      },
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
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderNewRegisterPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
