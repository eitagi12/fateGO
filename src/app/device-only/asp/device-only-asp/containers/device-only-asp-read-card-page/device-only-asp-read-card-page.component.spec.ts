/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAspReadCardPageComponent } from './device-only-asp-read-card-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { Router } from '@angular/router';
import { HomeService, ReadCardService, PageLoadingService, AlertService, ApiRequestService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { BsModalService } from 'ngx-bootstrap';
import { FormBuilder } from '@angular/forms';
import { BillingAddressService } from 'src/app/device-only/services/billing-address.service';
import { CustomerInformationService } from 'src/app/device-only/services/customer-information.service';
import { CreateOrderService } from 'src/app/device-only/services/create-order.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate' })
class MockPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('DeviceOnlyAspReadCardPageComponent', () => {
  let component: DeviceOnlyAspReadCardPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAspReadCardPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule.withRoutes([])
    ],
    declarations: [
      DeviceOnlyAspReadCardPageComponent,
      MockPipe
    ],
    providers: [
      HttpClient,
      HttpHandler,
      CookiesStorageService,
      LocalStorageService,
      {
        provide: JwtHelperService,
        useValue: {}
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      {
        provide: BsModalService,
        useValue: {
          show: jest.fn()
        }
      },
      FormBuilder,
      ReadCardService,
      {
        provide: PageLoadingService,
        useValue: {
          openLoading: jest.fn(),
          closeLoading: jest.fn()
        }
      },
      AlertService,
      {
        provide: BillingAddressService,
        useValue: {
          getLocationName: jest.fn(() => {
            return Promise.resolve();
          })
        }
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn()
        }
      },
      {
        provide: HomeService,
        useValue: {
          goToHome: jest.fn()
        }
      },
      CustomerInformationService,
      CreateOrderService,
      ApiRequestService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAspReadCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
