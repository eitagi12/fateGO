import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPageComponent } from './product-page.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CookiesStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt/src/jwthelper.service';
import { JwtModule } from '@auth0/angular-jwt';

describe('ProductPageComponent', () => {
  let component: ProductPageComponent;
  let fixture: ComponentFixture<ProductPageComponent>;
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
        HttpClientModule,
        JwtModule.forRoot(mockConfigJwtModule)
      ],
      declarations: [
        ProductPageComponent
      ],
      providers: [
        CookiesStorageService,
        mockJwtHelperService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
