import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { DeviceOnlyAisSelectMobileCarePageComponent } from './device-only-ais-select-mobile-care-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { TransactionService } from 'src/app/shared/services/transaction.service';

describe('DeviceOnlyAisSelectMobileCarePageComponent', () => {
  let component: DeviceOnlyAisSelectMobileCarePageComponent;
  let fixture: ComponentFixture<DeviceOnlyAisSelectMobileCarePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ DeviceOnlyAisSelectMobileCarePageComponent ],
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
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceOnlyAisSelectMobileCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
