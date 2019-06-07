import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandPageComponent } from './brand-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
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
  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [
      BrandPageComponent
    ],
    providers: [
      mockTokenService
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
