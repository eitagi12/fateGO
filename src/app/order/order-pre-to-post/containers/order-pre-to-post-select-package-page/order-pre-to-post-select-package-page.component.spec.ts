import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPreToPostSelectPackagePageComponent } from './order-pre-to-post-select-package-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'ngx-store';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

describe('OrderPreToPostSelectPackagePageComponent', () => {
  let component: OrderPreToPostSelectPackagePageComponent;
  let fixture: ComponentFixture<OrderPreToPostSelectPackagePageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ModalModule.forRoot(),
      HttpClientModule
    ],
    declarations: [OrderPreToPostSelectPackagePageComponent],
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
                mainPackageOneLove: {},
                simCard: {
                  mobileNo: ''
                }
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
    fixture = TestBed.createComponent(OrderPreToPostSelectPackagePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
