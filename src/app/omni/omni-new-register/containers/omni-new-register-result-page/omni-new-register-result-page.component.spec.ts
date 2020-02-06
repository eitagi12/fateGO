import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterResultPageComponent } from './omni-new-register-result-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { TokenService, PageLoadingService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}
describe('OmniNewRegisterResultPageComponent', () => {
  let component: OmniNewRegisterResultPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterResultPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [
      OmniNewRegisterResultPageComponent,
      MockMobileNoPipe
    ],
    providers: [
      LocalStorageService,
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                mainPackage: {},
                billingInformation: {
                  billCycleData: {},
                  billDeliveryAddress: {}
                },
                customer: {},
                simCard: {
                  mobileNo: ''
                },
                faceRecognition: {}
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
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn()
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
