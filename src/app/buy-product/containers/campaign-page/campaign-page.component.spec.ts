import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignPageComponent } from './campaign-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CookiesStorageService, LocalStorageService } from 'ngx-store';
import { JwtModule } from '@auth0/angular-jwt';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { TokenService } from 'mychannel-shared-libs';

@Pipe({name: 'privilegeToTradeSlider'})
class MockPrivilegeToTradeSlider implements PipeTransform {
  transform(value: string): string {
      return value;
  }
}

describe('CampaignPageComponent', () => {
  let component: CampaignPageComponent;
  let fixture: ComponentFixture<CampaignPageComponent>;
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
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        ModalModule.forRoot(),
        JwtModule.forRoot(mockConfigJwtModule)
      ],
      providers: [
        CookiesStorageService,
        LocalStorageService,
        mockJwtHelperService,
        mockTokenService
      ],
      declarations: [
        CampaignPageComponent,
        MockPrivilegeToTradeSlider
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
