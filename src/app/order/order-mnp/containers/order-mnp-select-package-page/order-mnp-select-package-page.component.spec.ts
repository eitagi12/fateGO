import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpSelectPackagePageComponent } from './order-mnp-select-package-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderMnpSelectPackagePageComponent', () => {
  let component: OrderMnpSelectPackagePageComponent;
  let fixture: ComponentFixture<OrderMnpSelectPackagePageComponent>;

  setupTestBed({
    imports: [ RouterTestingModule, HttpClientModule, ModalModule.forRoot() ],
    declarations: [OrderMnpSelectPackagePageComponent],
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
          getUser: jest.fn()
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
    fixture = TestBed.createComponent(OrderMnpSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
