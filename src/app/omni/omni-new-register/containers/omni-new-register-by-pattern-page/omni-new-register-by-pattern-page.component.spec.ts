import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniNewRegisterByPatternPageComponent } from './omni-new-register-by-pattern-page.component';
import { Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Transaction } from 'src/app/shared/models/transaction.model';
import { TokenService } from 'mychannel-shared-libs';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Pipe({name: 'mobileNo'})
class MockMobileNoPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('OmniNewRegisterByPatternPageComponent', () => {
  let component: OmniNewRegisterByPatternPageComponent;
  let fixture: ComponentFixture<OmniNewRegisterByPatternPageComponent>;

  setupTestBed({
    imports: [
      RouterTestingModule,
      HttpClientModule,
      ReactiveFormsModule
    ],
    declarations: [
      OmniNewRegisterByPatternPageComponent,
      MockMobileNoPipe
    ],
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
      },
      {
        provide: TransactionService,
        useValue: {
          load: jest.fn(() => {
            return {
              data: {
                customer: {}
              }
            } as Transaction;
          })
        }
      }
    ]
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniNewRegisterByPatternPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
