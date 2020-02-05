import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterFaceConfirmPageComponent } from './omni-new-register-face-confirm-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';

describe('OmniNewRegisterFaceConfirmPageComponent', () => {
  let component: OmniNewRegisterFaceConfirmPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterFaceConfirmPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      ReactiveFormsModule,
      HttpClientModule
    ],
    declarations: [OmniNewRegisterFaceConfirmPageComponent],
    providers: [
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
    fixture = TestBed.createComponent(OmniNewRegisterFaceConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
