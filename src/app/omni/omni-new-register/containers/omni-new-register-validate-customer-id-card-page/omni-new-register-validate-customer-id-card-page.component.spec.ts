import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterValidateCustomerIdCardPageComponent } from './omni-new-register-validate-customer-id-card-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';

describe('OmniNewRegisterValidateCustomerIdCardPageComponent', () => {
  let component: OmniNewRegisterValidateCustomerIdCardPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterValidateCustomerIdCardPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule,
    ],
    declarations: [
      OmniNewRegisterValidateCustomerIdCardPageComponent
    ],
    providers: [
      LocalStorageService,
      {
        provide: TokenService,
        useValue: {
          getUser: jest.fn(() => {
            return {
              channelType: ''
            };
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterValidateCustomerIdCardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
