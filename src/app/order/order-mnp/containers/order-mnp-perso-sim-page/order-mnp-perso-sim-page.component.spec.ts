import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpPersoSimPageComponent } from './order-mnp-perso-sim-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpPersoSimPageComponent', () => {
  let component: OrderMnpPersoSimPageComponent;
  let fixture: ComponentFixture<OrderMnpPersoSimPageComponent>;

  setupTestBed({
    imports: [RouterTestingModule, HttpClientModule],
    declarations: [OrderMnpPersoSimPageComponent],
    providers: [
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                simCard: {
                  mobileNo: ''
                }
              }
            } as Transaction;
          })
        }
      },
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
    fixture = TestBed.createComponent(OrderMnpPersoSimPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
