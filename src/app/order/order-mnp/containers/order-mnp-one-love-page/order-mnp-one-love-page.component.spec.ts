import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMnpOneLovePageComponent } from './order-mnp-one-love-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from 'ngx-store';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

xdescribe('OrderMnpOneLovePageComponent', () => {
  let component: OrderMnpOneLovePageComponent;
  let fixture: ComponentFixture<OrderMnpOneLovePageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OrderMnpOneLovePageComponent],
    providers: [
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                mainPackage: {},
                mainPackageOneLove: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMnpOneLovePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
