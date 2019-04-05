import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceOnlyAisSummaryPageComponent } from './device-only-ais-summary-page.component';
import { Router } from '@angular/router';
import { HomeService, TokenService } from 'mychannel-shared-libs';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { HttpClient } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}
describe('DeviceOnlyAisSummaryPageComponent', () => {
  let component: DeviceOnlyAisSummaryPageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSummaryPageComponent>;

  setupTestBed({
    declarations: [DeviceOnlyAisSummaryPageComponent, MockMobileNoPipe],
    providers: [
      HttpClient,
      HttpHandler,
      CookiesStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn()
        }
      },
      {
        provide: Router,
        useValue: {
          navigate: jest.fn()
        }
      },
      {
        provide: HomeService,
        useValue: {
          goToHome: jest.fn()
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
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
