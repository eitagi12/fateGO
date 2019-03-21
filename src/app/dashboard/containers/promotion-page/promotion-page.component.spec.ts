import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionPageComponent } from './promotion-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { CookiesStorageService } from 'ngx-store';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenService } from 'mychannel-shared-libs';

describe('PromotionPageComponent', () => {
  let component: PromotionPageComponent;
  let fixture: ComponentFixture<PromotionPageComponent>;
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
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ModalModule.forRoot(),
        JwtModule.forRoot(mockConfigJwtModule)
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      declarations: [
        PromotionPageComponent
      ],
      providers: [
        CookiesStorageService,
        mockJwtHelperService,
        mockTokenService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
