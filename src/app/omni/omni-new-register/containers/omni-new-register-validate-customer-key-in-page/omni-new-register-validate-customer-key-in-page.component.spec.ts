import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterValidateCustomerKeyInPageComponent } from './omni-new-register-validate-customer-key-in-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from 'mychannel-shared-libs';
import { LocalStorageService } from 'ngx-store';
import { HttpClientModule } from '@angular/common/http';

describe('OmniNewRegisterValidateCustomerKeyInPageComponent', () => {
  let component: OmniNewRegisterValidateCustomerKeyInPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterValidateCustomerKeyInPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule
    ],
    declarations: [OmniNewRegisterValidateCustomerKeyInPageComponent],
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
    fixture = TestBed.createComponent(OmniNewRegisterValidateCustomerKeyInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
