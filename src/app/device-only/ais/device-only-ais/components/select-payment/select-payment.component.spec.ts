import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPaymentComponent } from './select-payment.component';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { PriceOptionService } from 'src/app/shared/services/price-option.service';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';

@Pipe({name: 'number'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
      return value;
    }
}

describe('SelectPaymentComponent', () => {
  let component: SelectPaymentComponent;
  let fixture: ComponentFixture<SelectPaymentComponent>;

  setupTestBed({
    imports: [
      ReactiveFormsModule,
      TranslateModule
    ],
    declarations: [
      SelectPaymentComponent,
      MockPipe
    ],
    providers: [
      CookiesStorageService,
      {
        provide: JwtHelperService,
        useValue: {}
      },
      HttpClient,
      HttpHandler,
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn()
        }
      },
      {
        provide: PriceOptionService,
        useValue: {
          load: jest.fn(() => {
            return {
              productDetail: {},
              productStock: {},
              trade: {}
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
