import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotionPageComponent } from './promotion-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule } from 'ngx-bootstrap';
import { HttpClientModule } from '@angular/common/http';
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

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule,
      ModalModule.forRoot()
    ],
    schemas: [
    ],
    declarations: [
      PromotionPageComponent
    ],
    providers: [mockTokenService
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
