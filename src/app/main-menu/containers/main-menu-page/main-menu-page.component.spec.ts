import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuPageComponent } from './main-menu-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiesStorageService } from 'ngx-store';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from 'mychannel-shared-libs';

describe('MainMenuPageComponent', () => {
  let component: MainMenuPageComponent;
  let fixture: ComponentFixture<MainMenuPageComponent>;
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
        JwtModule.forRoot(mockConfigJwtModule)
      ],
      declarations: [
        MainMenuPageComponent
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
    fixture = TestBed.createComponent(MainMenuPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
