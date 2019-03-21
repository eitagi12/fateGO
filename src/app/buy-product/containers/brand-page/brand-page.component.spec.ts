import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandPageComponent } from './brand-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { TokenService } from 'mychannel-shared-libs';

describe('BrandPageComponent', () => {
  let component: BrandPageComponent;
  let fixture: ComponentFixture<BrandPageComponent>;
  const mockTokenService: any = {
    provide: TokenService,
    useValue: {
      getUser: () => {
        return { locationCode: '' };
      }
    }
  };
  const mockJwtHelperService: any = {
    provide: JwtHelperService,
    useValue: {}
  };

  const mockConfigJwtModule: any = {
    config: {
      tokenGetter: () => {
        return '';
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        JwtModule.forRoot(mockConfigJwtModule)
      ],
      declarations: [
        BrandPageComponent
      ],
      providers: [
        CookiesStorageService,
        LocalStorageService,
        mockJwtHelperService,
        mockTokenService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
